import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function TermsOfUsePage() {
  return (
    <>
      <Helmet>
        <title>Terms of Use - Petrosia</title>
        <meta name="description" content="Terms and conditions for using the Petrosia pet marketplace platform." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/terms-of-use">Terms of Use</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Terms of Use</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: April 9, 2025</p>

          <div className="prose max-w-none">
            <h2>Introduction</h2>
            <p>
              Welcome to Petrosia, a pet marketplace platform operated by SHIPIO LOGISTICS PVT LTD 
              ("Company", "we", "our", or "us"). By accessing or using our website, mobile 
              application, or any services provided by us (collectively, the "Services"), you agree 
              to be bound by these Terms of Use ("Terms").
            </p>
            <p>
              Please read these Terms carefully before using our Services. If you do not agree to 
              these Terms, you must not access or use our Services.
            </p>

            <h2>Eligibility</h2>
            <p>
              By using our Services, you represent and warrant that:
            </p>
            <ul>
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter into a binding agreement</li>
              <li>You are not barred from using our Services under applicable law</li>
              <li>You are using our Services for a lawful purpose</li>
            </ul>
            <p>
              If you are using our Services on behalf of a business or other entity, you further 
              represent and warrant that you have the authority to bind that entity to these Terms.
            </p>

            <h2>User Accounts</h2>
            <h3>Account Creation</h3>
            <p>
              To access certain features of our Services, you may need to create a user account. When 
              creating an account, you must provide accurate, current, and complete information. You 
              are responsible for maintaining the confidentiality of your account credentials and for 
              all activities that occur under your account.
            </p>

            <h3>Account Types</h3>
            <p>
              We offer different types of accounts based on your role in the pet ecosystem:
            </p>
            <ul>
              <li><strong>Buyer:</strong> Individuals looking to purchase pets or pet-related products</li>
              <li><strong>Seller:</strong> Breeders, pet shops, or individuals looking to sell pets</li>
              <li><strong>Service Provider:</strong> Businesses offering pet-related services</li>
            </ul>
            <p>
              Each account type may have specific requirements, features, and obligations as detailed 
              in our guidelines and policies.
            </p>

            <h3>Account Security</h3>
            <p>
              You are responsible for safeguarding your account and for any activities or actions under 
              your account. You must notify us immediately of any unauthorized access to or use of your 
              account. We cannot and will not be liable for any loss or damage arising from your failure 
              to comply with these requirements.
            </p>

            <h2>Pet Listings and Transactions</h2>
            <h3>Listing Requirements</h3>
            <p>
              If you are a seller listing pets on our platform, you must:
            </p>
            <ul>
              <li>Provide accurate, complete, and truthful information about the pets you list</li>
              <li>Include clear and current photographs of the actual pet being listed</li>
              <li>Disclose all relevant health information, including vaccination records</li>
              <li>Specify breed, age, gender, and other relevant characteristics</li>
              <li>Clearly state the price and any conditions of sale</li>
              <li>Comply with all applicable laws and regulations regarding pet breeding and sales</li>
            </ul>
            <p>
              We reserve the right to remove any listing that violates these requirements or that we 
              determine, in our sole discretion, is inappropriate for our platform.
            </p>

            <h3>Transaction Process</h3>
            <p>
              Our platform facilitates connections between buyers and sellers. While we strive to 
              create a safe and trustworthy environment, we do not:
            </p>
            <ul>
              <li>Guarantee the quality or health of any pet listed on our platform</li>
              <li>Take possession of or title to any pet listed</li>
              <li>Become a party to any transaction between users</li>
              <li>Guarantee the completion or validity of any transaction</li>
            </ul>
            <p>
              Users are solely responsible for:
            </p>
            <ul>
              <li>Evaluating the suitability of any pet before purchase</li>
              <li>Arranging for inspection or examination of a pet before purchase</li>
              <li>Negotiating and finalizing the terms of any transaction</li>
              <li>Completing payment and delivery arrangements</li>
              <li>Complying with applicable laws regarding pet ownership and transfer</li>
            </ul>

            <h3>Prohibited Activities</h3>
            <p>
              The following activities are strictly prohibited on our platform:
            </p>
            <ul>
              <li>Listing or selling pets for illegal purposes (e.g., dogfighting)</li>
              <li>Listing endangered species or protected wildlife</li>
              <li>Misrepresenting the breed, health, age, or other characteristics of a pet</li>
              <li>Selling pets that have not received appropriate vaccinations and care</li>
              <li>Engaging in puppy or kitten mill operations</li>
              <li>Creating fraudulent listings or engaging in scams</li>
              <li>Harassing or intimidating other users</li>
            </ul>
            <p>
              Violation of these prohibitions may result in immediate termination of your account 
              and may be reported to relevant authorities.
            </p>

            <h2>Content Guidelines</h2>
            <h3>User-Generated Content</h3>
            <p>
              Our Services may allow you to post, link, store, share, and otherwise make available 
              text, images, videos, or other materials ("Content"). You are solely responsible for 
              any Content you post on or through our Services.
            </p>
            <p>
              By posting Content on our platform, you grant us a non-exclusive, transferable, 
              sub-licensable, royalty-free, worldwide license to use, copy, modify, create derivative 
              works based on, distribute, publicly display, publicly perform, and otherwise exploit 
              that Content in connection with our Services and our business.
            </p>

            <h3>Prohibited Content</h3>
            <p>
              You agree not to post Content that:
            </p>
            <ul>
              <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, or invasive of another's privacy</li>
              <li>Infringes or violates any third party's intellectual property or other rights</li>
              <li>Contains software viruses or any other code designed to interrupt, destroy, or limit the functionality of our Services</li>
              <li>Is false, misleading, or deceptive</li>
              <li>Promotes illegal activities or harmful conduct</li>
              <li>Is obscene, pornographic, or sexually explicit</li>
              <li>Depicts cruelty to animals</li>
            </ul>
            <p>
              We reserve the right, but not the obligation, to review, monitor, or remove any Content, 
              at our sole discretion and without notice.
            </p>

            <h2>Payment Terms</h2>
            <h3>Fees and Charges</h3>
            <p>
              We may charge fees for certain features or services. All fees are stated in Indian 
              Rupees (INR) and are non-refundable unless otherwise specified. We reserve the right 
              to change our fee structure at any time. Any changes to our fees will be posted on our 
              platform and will take effect upon posting.
            </p>

            <h3>Payment Processing</h3>
            <p>
              We use third-party payment processors to facilitate transactions. By using our payment 
              services, you agree to be bound by the terms and privacy policies of these payment 
              processors, in addition to our Terms.
            </p>

            <h2>Intellectual Property</h2>
            <h3>Our Intellectual Property</h3>
            <p>
              Our Services and their entire contents, features, and functionality (including but not 
              limited to all information, software, text, displays, images, video, and audio, and the 
              design, selection, and arrangement thereof), are owned by us, our licensors, or other 
              providers of such material and are protected by copyright, trademark, patent, trade 
              secret, and other intellectual property or proprietary rights laws.
            </p>
            <p>
              These Terms permit you to use our Services for your personal, non-commercial use only. 
              You must not reproduce, distribute, modify, create derivative works of, publicly display, 
              publicly perform, republish, download, store, or transmit any of the material on our 
              Services, except as follows:
            </p>
            <ul>
              <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials</li>
              <li>You may store files that are automatically cached by your web browser for display enhancement purposes</li>
              <li>You may print or download one copy of a reasonable number of pages of the website for your own personal, non-commercial use and not for further reproduction, publication, or distribution</li>
            </ul>

            <h3>Trademark Notice</h3>
            <p>
              "Petrosia" and our logo, and all related names, logos, product and service names, 
              designs, and slogans are trademarks of SHIPIO LOGISTICS PVT LTD or its affiliates. You 
              must not use such marks without our prior written permission.
            </p>

            <h2>Disclaimer of Warranties</h2>
            <p>
              YOUR USE OF OUR SERVICES IS AT YOUR SOLE RISK. OUR SERVICES ARE PROVIDED ON AN "AS IS" 
              AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
              WE EXPRESSLY DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION 
              IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND 
              NON-INFRINGEMENT.
            </p>
            <p>
              WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT OR 
              COMMUNICATIONS ON OUR SERVICES, OR THAT OUR SERVICES WILL MEET YOUR REQUIREMENTS, BE 
              AVAILABLE ON AN UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE BASIS.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF 
              PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, 
              USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul>
              <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE OUR SERVICES</li>
              <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON OUR SERVICES, INCLUDING ANY DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF OTHER USERS OR THIRD PARTIES</li>
              <li>ANY CONTENT OBTAINED FROM OUR SERVICES</li>
              <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
            </ul>
            <p>
              IN NO EVENT SHALL OUR AGGREGATE LIABILITY EXCEED THE AMOUNT YOU PAID US, IF ANY, IN THE 
              PAST SIX MONTHS FOR THE SERVICES GIVING RISE TO THE CLAIM.
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless SHIPIO LOGISTICS PVT LTD, its 
              affiliates, licensors, and service providers, and its and their respective officers, 
              directors, employees, contractors, agents, licensors, suppliers, successors, and 
              assigns from and against any claims, liabilities, damages, judgments, awards, losses, 
              costs, expenses, or fees (including reasonable attorneys' fees) arising out of or 
              relating to your violation of these Terms or your use of our Services.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your access to all or part of our Services, without notice, 
              for any reason, including without limitation, breach of these Terms.
            </p>
            <p>
              You may terminate your account at any time by contacting us. Upon termination, your 
              right to use our Services will immediately cease.
            </p>
            <p>
              All provisions of these Terms which by their nature should survive termination shall 
              survive termination, including, without limitation, ownership provisions, warranty 
              disclaimers, indemnity, and limitations of liability.
            </p>

            <h2>Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. 
              Any dispute arising out of or in connection with these Terms, including any question 
              regarding its existence, validity, or termination, shall be referred to and finally 
              resolved by arbitration in Delhi, India, in accordance with the Arbitration and 
              Conciliation Act, 1996, by a sole arbitrator appointed by us.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We may revise and update these Terms from time to time at our sole discretion. All 
              changes are effective immediately when we post them and apply to all access to and use 
              of our Services thereafter.
            </p>
            <p>
              Your continued use of our Services following the posting of revised Terms means that you 
              accept and agree to the changes. You are expected to check this page frequently so you 
              are aware of any changes, as they are binding on you.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
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