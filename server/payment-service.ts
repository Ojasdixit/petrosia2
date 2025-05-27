import crypto from "crypto";
import https from "https";

// Cashfree API configuration
const API_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://api.cashfree.com/pg" 
  : "https://sandbox.cashfree.com/pg";

interface CreateOrderPayload {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  orderNote?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  returnUrl: string;
  notifyUrl?: string;
}

interface CashfreeResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_amount: number;
  order_currency: string;
  order_note?: string;
  payment_session_id: string;
  order_status: string;
  payment_link: string;
  settlements?: any;
  payments?: any;
  refunds?: any;
}

// Get credentials from environment variables
const appId = process.env.CASHFREE_APP_ID;
const secretKey = process.env.CASHFREE_SECRET_KEY;

// Check if credentials are available
if (!appId || !secretKey) {
  console.warn("Cashfree credentials not found. Payment service will operate in simulation mode.");
}

/**
 * Creates a payment order with Cashfree
 */
export async function createOrder(payload: CreateOrderPayload): Promise<{
  orderId: string;
  paymentLink: string;
  status: string;
  sessionId?: string;
  error?: string;
}> {
  try {
    // Validate required credentials
    if (!appId || !secretKey) {
      console.log("Running in simulation mode - returning dummy payment link");
      
      // In simulation mode, return mock data for testing
      return {
        orderId: payload.orderId,
        status: "ACTIVE",
        paymentLink: `/simulate-payment?orderId=${payload.orderId}&amount=${payload.orderAmount}`,
      };
    }
    
    // Prepare headers with authentication
    const headers = {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "Content-Type": "application/json",
    };
    
    // Make API request to create order using https
    return new Promise((resolve, reject) => {
      try {
        // Parse the API URL to get hostname and path
        const apiUrl = new URL(`${API_BASE_URL}/orders`);
        
        // Prepare request options
        const options = {
          method: 'POST',
          hostname: apiUrl.hostname,
          path: apiUrl.pathname,
          headers: {
            "x-client-id": appId,
            "x-client-secret": secretKey,
            "Content-Type": "application/json",
          }
        };
        
        // Create request
        const req = https.request(options, (res) => {
          let data = '';
          
          // Collect response data
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          // Process complete response
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              try {
                const responseData = JSON.parse(data) as CashfreeResponse;
                resolve({
                  orderId: responseData.order_id,
                  status: responseData.order_status,
                  paymentLink: responseData.payment_link,
                  sessionId: responseData.payment_session_id,
                });
              } catch (parseError) {
                console.error("Error parsing Cashfree response:", parseError);
                resolve({
                  orderId: payload.orderId,
                  status: "ERROR",
                  paymentLink: "",
                  error: "Failed to parse payment gateway response",
                });
              }
            } else {
              console.error("Cashfree API error:", data);
              resolve({
                orderId: payload.orderId,
                status: "ERROR",
                paymentLink: "",
                error: `Payment gateway error: ${res.statusCode}`,
              });
            }
          });
        });
        
        // Handle request errors
        req.on('error', (error) => {
          console.error("Error making Cashfree request:", error);
          resolve({
            orderId: payload.orderId,
            status: "ERROR",
            paymentLink: "",
            error: "Failed to connect to payment gateway",
          });
        });
        
        // Send the payload
        req.write(JSON.stringify(payload));
        req.end();
      } catch (error) {
        console.error("Error creating Cashfree order:", error);
        resolve({
          orderId: payload.orderId,
          status: "ERROR",
          paymentLink: "",
          error: "Failed to initialize payment gateway request",
        });
      }
    });
  } catch (error) {
    console.error("Error creating Cashfree order:", error);
    
    return {
      orderId: payload.orderId,
      status: "ERROR",
      paymentLink: "",
      error: "Failed to connect to payment gateway",
    };
  }
}

/**
 * Verify the signature in webhook notifications
 */
export function verifyWebhookSignature(
  payload: any,
  signature: string
): boolean {
  try {
    if (!secretKey) {
      console.warn("Webhook signature verification skipped (simulation mode)");
      return true;
    }
    
    // Create data string from payload
    const data = JSON.stringify(payload);
    
    // Calculate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("hex");
    
    // Compare signatures
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

/**
 * Get order details from Cashfree
 */
export async function getOrderStatus(orderId: string): Promise<{
  status: string;
  orderDetails?: any;
  error?: string;
}> {
  try {
    // Validate required credentials
    if (!appId || !secretKey) {
      console.log("Running in simulation mode - returning dummy order status");
      
      // In simulation mode, return mock data for testing
      return {
        status: "PAID",
        orderDetails: {
          orderId,
          orderStatus: "PAID",
          orderAmount: 1000,
          orderCurrency: "INR",
        },
      };
    }
    
    // Prepare headers with authentication
    const headers = {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "Content-Type": "application/json",
    };
    
    // Make API request to get order details using https
    return new Promise((resolve) => {
      try {
        // Parse the API URL to get hostname and path
        const apiUrl = new URL(`${API_BASE_URL}/orders/${orderId}`);
        
        // Prepare request options
        const options = {
          method: 'GET',
          hostname: apiUrl.hostname,
          path: apiUrl.pathname,
          headers: {
            "x-client-id": appId,
            "x-client-secret": secretKey,
            "Content-Type": "application/json",
          }
        };
        
        // Create request
        const req = https.request(options, (res) => {
          let data = '';
          
          // Collect response data
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          // Process complete response
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              try {
                const responseData = JSON.parse(data);
                resolve({
                  status: responseData.order_status,
                  orderDetails: responseData,
                });
              } catch (parseError) {
                console.error("Error parsing Cashfree response:", parseError);
                resolve({
                  status: "ERROR",
                  error: "Failed to parse payment gateway response",
                });
              }
            } else {
              console.error("Cashfree API error:", data);
              resolve({
                status: "ERROR",
                error: `Payment gateway error: ${res.statusCode}`,
              });
            }
          });
        });
        
        // Handle request errors
        req.on('error', (error) => {
          console.error("Error making Cashfree request:", error);
          resolve({
            status: "ERROR",
            error: "Failed to connect to payment gateway",
          });
        });
        
        // End request
        req.end();
      } catch (error) {
        console.error("Error fetching order status:", error);
        resolve({
          status: "ERROR",
          error: "Failed to initialize payment gateway request",
        });
      }
    });
  } catch (error) {
    console.error("Error fetching order status:", error);
    
    return {
      status: "ERROR",
      error: "Failed to connect to payment gateway",
    };
  }
}

/**
 * Generate a unique order ID
 */
export function generateOrderId(prefix: string = "PET"): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
}