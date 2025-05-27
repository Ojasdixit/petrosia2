import express, { Request, Response, Router } from "express";
import { createOrder, generateOrderId, getOrderStatus, verifyWebhookSignature } from "./payment-service";
import { storage } from "./storage";
import { z } from "zod";
import { BookingStatus, PaymentStatus } from "@shared/schema";

// Create Express router
const router = Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Create a payment order
router.post("/api/payments/create-order", isAuthenticated, async (req, res) => {
  try {
    // Generate a unique order ID
    const orderId = generateOrderId();
    
    // Extract booking details from request
    const {
      providerId,
      providerName,
      serviceType,
      amount,
      petName,
      petType,
      petBreed,
      startDate,
      endDate,
      numberOfDays,
      numberOfVisits,
      specialInstructions,
      userId,
      userEmail,
      userPhone,
      userName,
    } = req.body;
    
    // Validate required fields
    if (!providerId || !serviceType || !amount || !petName || !startDate || !userId) {
      return res.status(400).json({
        message: "Missing required booking details",
      });
    }
    
    // Create the booking record first
    const booking = await storage.createServiceBooking({
      userId,
      providerId,
      serviceType,
      petName,
      petType,
      petBreed,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      numberOfDays: numberOfDays || 1,
      numberOfVisits: numberOfVisits || 1,
      specialInstructions: specialInstructions || "",
      status: BookingStatus.PENDING,
      amount,
      createdAt: new Date(),
    });
    
    // Create a payment record
    const payment = await storage.createPayment({
      orderId,
      bookingId: booking.id,
      userId,
      amount,
      currency: "INR",
      status: PaymentStatus.PENDING,
      paymentMethod: "unknown",
      createdAt: new Date(),
      description: `${serviceType} service at ${providerName}`,
    });
    
    // Set up return URL for after payment completion
    const appUrl = process.env.APP_URL || `http://${req.get("host") || "localhost:5000"}`;
    const returnUrl = `${appUrl}/api/payments/callback?orderId=${orderId}`;
    
    // Create order with payment gateway
    const orderPayload = {
      orderId,
      orderAmount: amount,
      orderCurrency: "INR",
      orderNote: `Booking for ${serviceType} service`,
      customerName: userName || "Customer",
      customerEmail: userEmail || "customer@example.com",
      customerPhone: userPhone || "9999999999",
      returnUrl,
      notifyUrl: `${appUrl}/api/payments/webhook`,
    };
    
    const order = await createOrder(orderPayload);
    
    if (order.error) {
      return res.status(400).json({
        message: order.error,
        orderId
      });
    }
    
    return res.status(200).json({
      message: "Order created successfully",
      orderId: order.orderId,
      paymentLink: order.paymentLink,
      bookingId: booking.id,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return res.status(500).json({
      message: "Failed to create payment order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Payment callback route (user is redirected here after payment)
router.get("/api/payments/callback", async (req, res) => {
  try {
    const { orderId } = req.query;
    
    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    // Get payment details from storage
    const payment = await storage.getPaymentByOrderId(orderId);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    // Check payment status with gateway
    const orderStatus = await getOrderStatus(orderId);
    
    // Update payment status based on gateway response
    if (orderStatus.status === "PAID") {
      // Update payment status
      await storage.updatePaymentStatus(payment.id, PaymentStatus.COMPLETED);
      
      // Update booking status
      if (payment.bookingId) {
        await storage.updateServiceBookingStatus(payment.bookingId, BookingStatus.CONFIRMED);
      }
      
      // Redirect to success page
      return res.redirect(`/booking-success?orderId=${orderId}`);
    } else if (orderStatus.status === "FAILED" || orderStatus.status === "CANCELLED") {
      // Update payment status
      await storage.updatePaymentStatus(payment.id, PaymentStatus.FAILED);
      
      // Redirect to failed page
      return res.redirect(`/booking-failed?orderId=${orderId}`);
    } else {
      // Payment is still pending, redirect to pending page
      return res.redirect(`/booking-pending?orderId=${orderId}`);
    }
  } catch (error) {
    console.error("Error in payment callback:", error);
    return res.redirect("/booking-error");
  }
});

// Webhook endpoint for payment notifications
router.post("/api/payments/webhook", express.json(), async (req, res) => {
  try {
    // Get signature from headers
    const signature = req.headers["x-cashfree-signature"] as string;
    
    if (!signature) {
      return res.status(400).json({ message: "Missing signature header" });
    }
    
    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(req.body, signature);
    
    if (!isValidSignature) {
      return res.status(401).json({ message: "Invalid signature" });
    }
    
    const { order } = req.body;
    
    if (!order || !order.order_id) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }
    
    const orderId = order.order_id;
    const status = order.order_status;
    
    // Get payment from database
    const payment = await storage.getPaymentByOrderId(orderId);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    // Update payment status based on webhook event
    if (status === "PAID") {
      await storage.updatePaymentStatus(payment.id, PaymentStatus.COMPLETED);
      
      // Update booking status if available
      if (payment.bookingId) {
        await storage.updateServiceBookingStatus(payment.bookingId, BookingStatus.CONFIRMED);
      }
    } else if (status === "FAILED" || status === "CANCELLED") {
      await storage.updatePaymentStatus(payment.id, PaymentStatus.FAILED);
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in payment webhook:", error);
    return res.status(500).json({
      message: "Error processing webhook",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get payment status by order ID
router.get("/api/payments/:orderId", isAuthenticated, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Get payment from database
    const payment = await storage.getPaymentByOrderId(orderId);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    // Get booking details if available
    let booking = null;
    if (payment.bookingId) {
      booking = await storage.getServiceBookingById(payment.bookingId);
    }
    
    // Check if user has access to this payment
    if (payment.userId !== req.user?.id && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access to payment" });
    }
    
    // Return payment details
    return res.status(200).json({
      payment,
      booking,
    });
  } catch (error) {
    console.error("Error getting payment:", error);
    return res.status(500).json({
      message: "Failed to get payment information",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Simulation page for testing payments when API keys are not available
router.get("/simulate-payment", (req, res) => {
  const { orderId, amount } = req.query;
  
  if (!orderId) {
    return res.status(400).send("Missing order ID");
  }
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Simulation</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #333;
        }
        .card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .amount {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 20px 0;
        }
        .btn {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 12px 20px;
          margin: 8px 0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          text-decoration: none;
        }
        .btn-cancel {
          background-color: #f44336;
        }
        .info {
          color: #666;
          font-size: 14px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Payment Simulation</h1>
      <div class="card">
        <p>Order ID: <strong>${orderId}</strong></p>
        <p class="amount">Amount: ₹${amount || "1000"}</p>
        <p>This is a simulation of the payment gateway.</p>
        <a href="/api/payments/callback?orderId=${orderId}" class="btn">Complete Payment</a>
        <a href="/booking-failed?orderId=${orderId}" class="btn btn-cancel">Cancel Payment</a>
      </div>
      <p class="info">Note: This is a simulation page for testing when payment gateway credentials are not available.</p>
    </body>
    </html>
  `;
  
  res.send(htmlContent);
});

export default router;