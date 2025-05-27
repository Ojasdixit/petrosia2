import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function RefundPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Refund & Cancellation Policy - Petrosia</title>
        <meta name="description" content="Petrosia's refund and cancellation policy for pet marketplace transactions and e-commerce purchases." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/refund-policy">Refund & Cancellation Policy</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Refund & Cancellation Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: April 9, 2025</p>

          <div className="prose max-w-none">
            <h2>Introduction</h2>
            <p>
              At Petrosia, operated by SHIPIO LOGISTICS PVT LTD, we strive to ensure your satisfaction with our 
              services and products. This Refund and Cancellation Policy outlines the terms and conditions for 
              returns, refunds, and cancellations of orders and transactions made through our website.
            </p>

            <h2>Pet Marketplace Transactions</h2>
            <h3>Reservation Fees and Deposits</h3>
            <p>
              Reservation fees or deposits paid to reserve a pet from a seller are generally non-refundable. 
              However, in the following circumstances, a refund may be considered:
            </p>
            <ul>
              <li>If the seller cannot provide the pet as described in the listing</li>
              <li>If the pet is found to have undisclosed health issues prior to completion of the sale</li>
              <li>If the transaction is canceled by the seller</li>
            </ul>
            <p>
              All refund requests for reservation fees must be submitted within 48 hours of making the payment.
            </p>

            <h3>Pet Purchase Cancellations</h3>
            <p>
              For pet purchase transactions that have not been completed (where the pet has not been handed over to the buyer):
            </p>
            <ul>
              <li><strong>Buyer Cancellation:</strong> If you cancel a confirmed pet purchase before taking possession of the pet, any refund will be at the discretion of the seller as per their cancellation policy.</li>
              <li><strong>Seller Cancellation:</strong> If a seller cancels a confirmed sale, any payment made by the buyer will be refunded in full.</li>
            </ul>
            <p>
              Please note that Petrosia acts only as a platform connecting buyers and sellers. The final decision on refunds for pet transactions is typically between the buyer and seller, except in cases of clear policy violations.
            </p>

            <h2>E-Commerce Product Purchases</h2>
            <h3>Return and Refund Eligibility</h3>
            <p>
              For physical products (pet supplies, accessories, food, etc.) purchased through our platform:
            </p>
            <ul>
              <li>Products must be returned within 7 days of delivery</li>
              <li>Products must be unused, undamaged, and in their original packaging</li>
              <li>Products must be accompanied by the original receipt or proof of purchase</li>
              <li>Customized or personalized products are not eligible for return unless defective</li>
              <li>Perishable items, food products, and consumables cannot be returned once opened</li>
            </ul>

            <h3>Refund Process for Products</h3>
            <p>
              When returning eligible products:
            </p>
            <ol>
              <li>Initiate a return request through your account or by contacting our customer service</li>
              <li>You will receive return instructions and a return authorization</li>
              <li>Return shipping costs are generally borne by the customer, except in cases of defective products</li>
              <li>Once we receive and inspect the returned item, we will process the refund</li>
              <li>Refunds will be issued to the original payment method within 10-14 business days</li>
            </ol>

            <h3>Cancellation of Product Orders</h3>
            <p>
              You can cancel your product order under the following conditions:
            </p>
            <ul>
              <li>For orders not yet shipped: Full refund will be processed</li>
              <li>For orders already shipped: Standard return policy applies upon receiving the product</li>
            </ul>
            <p>
              To cancel an order, please contact our customer service team immediately at <a href="mailto:contact@petrosia.in" className="text-primary hover:underline">contact@petrosia.in</a>.
            </p>

            <h2>Service Bookings and Cancellations</h2>
            <h3>Pet Care Services</h3>
            <p>
              For pet care services (grooming, veterinary checkups, boarding, etc.) booked through our platform:
            </p>
            <ul>
              <li><strong>Cancellation more than 48 hours before appointment:</strong> Full refund</li>
              <li><strong>Cancellation within 24-48 hours of appointment:</strong> 50% refund</li>
              <li><strong>Cancellation less than 24 hours before appointment:</strong> No refund (except in emergencies)</li>
              <li><strong>Rescheduling:</strong> Free if done more than 24 hours in advance</li>
            </ul>

            <h3>No-Show Policy</h3>
            <p>
              If you fail to show up for a scheduled service appointment without prior notice, no refund will be provided, and the full service fee will be charged.
            </p>

            <h2>Refund Method and Processing Time</h2>
            <p>
              All approved refunds will be processed back to the original payment method used for the purchase:
            </p>
            <ul>
              <li><strong>Credit/Debit Cards:</strong> 7-14 business days</li>
              <li><strong>UPI/Net Banking:</strong> 3-5 business days</li>
              <li><strong>Digital Wallets:</strong> 1-3 business days</li>
            </ul>
            <p>
              Please note that while we process refunds promptly, the actual time for the funds to reflect in your account depends on your payment provider's policies.
            </p>

            <h2>Special Circumstances</h2>
            <h3>Defective or Damaged Products</h3>
            <p>
              If you receive a defective or damaged product:
            </p>
            <ol>
              <li>Contact us within 48 hours of delivery with photos of the damaged item</li>
              <li>We will arrange for a return or replacement at our expense</li>
              <li>A full refund including shipping costs will be processed once we receive the returned item</li>
            </ol>

            <h3>Events Beyond Our Control</h3>
            <p>
              In case of cancellations due to unforeseen circumstances beyond our control (natural disasters, public emergencies, etc.), we will work with you to reschedule services or provide store credit for products, as appropriate.
            </p>

            <h2>Right to Refuse Refunds</h2>
            <p>
              We reserve the right to refuse refunds in the following situations:
            </p>
            <ul>
              <li>When return requests are made after the eligible return period</li>
              <li>For products that show signs of use, damage, or alteration by the customer</li>
              <li>When proof of purchase cannot be verified</li>
              <li>For items explicitly marked as non-returnable or final sale</li>
            </ul>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Refund and Cancellation Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about our Refund and Cancellation Policy, please contact us at:
            </p>
            <address className="not-italic">
              <strong>SHIPIO LOGISTICS PVT LTD</strong><br />
              Email: <a href="mailto:contact@petrosia.in" className="text-primary hover:underline">contact@petrosia.in</a><br />
              Website: <Link href="/" className="text-primary hover:underline">www.petrosia.in</Link>
            </address>
          </div>
        </div>
      </div>
    </>
  );
}