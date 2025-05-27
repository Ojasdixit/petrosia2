import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Petrosia</title>
        <meta name="description" content="Petrosia's privacy policy details how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/privacy-policy">Privacy Policy</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: April 9, 2025</p>

          <div className="prose max-w-none">
            <h2>Introduction</h2>
            <p>
              At Petrosia, operated by SHIPIO LOGISTICS PVT LTD ("we", "our", or "us"), we are committed to protecting your 
              privacy and personal information. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website or use our services.
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge 
              that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy. 
              If you do not agree with our policies and practices, please do not use our services.
            </p>

            <h2>Information We Collect</h2>
            <p>We collect several types of information from and about users of our platform, including:</p>

            <h3>Personal Information</h3>
            <p>
              When you register for an account, list a pet, make a purchase, or engage with our services, 
              we may collect:
            </p>
            <ul>
              <li>Contact information (name, email address, phone number, postal address)</li>
              <li>Account credentials (username, password)</li>
              <li>Payment information (credit card details, bank information)</li>
              <li>Profile information (profile pictures, preferences)</li>
              <li>Pet-related information (pet details, photos, health records, breeding information)</li>
              <li>For sellers: business information, identification documents, breeding licenses</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website or use our app, we automatically collect:</p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, referring URLs)</li>
              <li>Location data (if permitted by your device settings)</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h3>Information from Third Parties</h3>
            <p>
              We may receive information about you from third parties such as social media platforms, 
              payment processors, and verification services.
            </p>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Create and maintain your account</li>
              <li>Process and fulfill your transactions</li>
              <li>Connect buyers with sellers</li>
              <li>Verify seller credentials and pet information</li>
              <li>Process payments and prevent fraudulent activities</li>
              <li>Provide customer support</li>
              <li>Send administrative notifications and service updates</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Personalize your experience on our platform</li>
              <li>Improve our services and develop new features</li>
              <li>Analyze usage patterns and conduct market research</li>
              <li>Comply with legal obligations</li>
              <li>Enforce our terms and policies</li>
            </ul>

            <h2>How We Share Your Information</h2>
            <p>We may share your personal information with:</p>

            <h3>Users of Our Platform</h3>
            <p>
              When you list a pet or contact a seller, certain information is shared between parties to 
              facilitate the transaction. For example, when you list a pet, your listing information, 
              username, and contact details are shared with potential buyers.
            </p>

            <h3>Service Providers</h3>
            <p>
              We share information with third-party vendors, consultants, and other service providers who 
              perform services on our behalf, such as payment processing, data analysis, email delivery, 
              hosting services, and customer service.
            </p>

            <h3>Business Partners</h3>
            <p>
              We may share information with business partners to offer you certain products, services, 
              or promotions related to pet care, such as veterinary services or pet insurance.
            </p>

            <h3>Legal Requirements</h3>
            <p>
              We may disclose your information to comply with applicable laws and regulations, to respond 
              to a subpoena, search warrant, or other lawful request for information we receive, or to 
              otherwise protect our rights.
            </p>

            <h3>Business Transfers</h3>
            <p>
              If we are involved in a merger, acquisition, financing, or sale of business assets, your 
              information may be transferred as part of that transaction.
            </p>

            <h2>Cookie Policy</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and hold 
              certain information. Cookies are files with a small amount of data which may include an 
              anonymous unique identifier.
            </p>
            <p>
              We use the following types of cookies:
            </p>
            <ul>
              <li><strong>Essential cookies:</strong> These are necessary for the website to function properly.</li>
              <li><strong>Preference cookies:</strong> These remember your settings and preferences.</li>
              <li><strong>Analytics cookies:</strong> These help us understand how you interact with our website.</li>
              <li><strong>Marketing cookies:</strong> These track your activity to deliver relevant advertisements.</li>
            </ul>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
              However, if you do not accept cookies, you may not be able to use some portions of our platform.
            </p>

            <h2>Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to 
              protect the security of any personal information we process. However, please also remember 
              that we cannot guarantee that the internet itself is 100% secure.
            </p>
            <p>
              While we strive to use commercially acceptable means to protect your personal information, 
              we cannot guarantee its absolute security. Any transmission of personal information is at 
              your own risk. We are not responsible for circumvention of any privacy settings or security 
              measures contained on the platform.
            </p>

            <h2>Data Retention</h2>
            <p>
              We will retain your personal information only for as long as is necessary for the purposes 
              set out in this Privacy Policy, or as needed to comply with our legal obligations, resolve 
              disputes, and enforce our legal agreements and policies.
            </p>
            <p>
              When we no longer need your personal information, we will securely delete or anonymize it 
              so that it can no longer be associated with you.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children under 18. If you are a parent or guardian and you are aware 
              that your child has provided us with personal information, please contact us. If we become 
              aware that we have collected personal information from children without verification of 
              parental consent, we take steps to remove that information from our servers.
            </p>

            <h2>Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing of your personal information</li>
              <li>Data portability</li>
              <li>Objection to processing of your personal information</li>
              <li>Withdrawal of consent</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the information provided in the 
              "Contact Us" section below.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites, services, or applications that are 
              not operated by us. We have no control over and assume no responsibility for the content, 
              privacy policies, or practices of any third-party sites or services. We strongly advise you 
              to review the privacy policy of every site you visit.
            </p>

            <h2>Updates to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date. You are 
              advised to review this Privacy Policy periodically for any changes. Changes to this Privacy 
              Policy are effective when they are posted on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <address className="not-italic">
              <strong>SHIPIO LOGISTICS PVT LTD</strong><br />
              Email: <a href="mailto:contact@petrosia.in" className="text-primary hover:underline">contact@petrosia.in</a><br />
              Address: C29 1st floor bela bhawan nehru nagar adarsh nagar delhi, 110033<br />
              Website: <Link href="/" className="text-primary hover:underline">www.petrosia.in</Link>
            </address>
          </div>
        </div>
      </div>
    </>
  );
}