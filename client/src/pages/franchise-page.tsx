import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

// Testimonial component for franchise reviews
const FranchiseTestimonial = ({
  name,
  location,
  testimonial,
}: {
  name: string;
  location: string;
  testimonial: string;
}) => (
  <Card className="h-full">
    <CardContent className="pt-6">
      <div>
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{location}</p>
      </div>
      <blockquote className="mt-4 border-l-2 pl-4 italic">
        "{testimonial}"
      </blockquote>
    </CardContent>
  </Card>
);

// City section component
const CitySection = ({
  city,
  description,
  stats,
  franchisees,
}: {
  city: string;
  description: string;
  stats: { label: string; value: string }[];
  franchisees: { name: string; testimonial: string; }[];
}) => (
  <TabsContent value={city.toLowerCase()}>
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">{city} Franchise Opportunities</h3>
      <p className="text-muted-foreground">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <h4 className="text-xl font-semibold mt-8 mb-4">Our Successful Franchise Owners</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {franchisees.map((franchisee, i) => (
          <FranchiseTestimonial
            key={i}
            name={franchisee.name}
            location={`${city} Franchise Owner`}
            testimonial={franchisee.testimonial}
          />
        ))}
      </div>
    </div>
  </TabsContent>
);

const FranchisePage = () => {
  const { user } = useAuth();

  // Example franchise owners
  const franchiseOwners = {
    mumbai: [
      {
        name: "Rajesh Sharma",
        testimonial:
          "Joining Petrosia as a franchise owner was the best business decision I made. With zero setup fees and an instant customer base, I was profitable within 3 months. The pet supply commissions have doubled my monthly revenue!"
      },
      {
        name: "Priya Malhotra",
        testimonial:
          "The support from Petrosia is unmatched. They helped me source rare breed puppies from other regions which I couldn't get locally. My customers love the variety, and I love the 5% commission on every Petrosia-supplied pet."
      },
    ],
    bangalore: [
      {
        name: "Karthik Reddy",
        testimonial:
          "As a tech professional who loves pets, I wanted a side business with minimal investment. Petrosia's franchise model was perfect - I operate on weekends from a small space, yet earn significantly through the commissions on pet food and accessories."
      },
      {
        name: "Vidya Suresh",
        testimonial:
          "The WhatsApp integration has transformed my business. Customers inquire about pets and then purchase all their supplies from me. Petrosia's franchise model has allowed me to build lasting relationships in my community."
      },
    ],
    chennai: [
      {
        name: "Arvind Kumar",
        testimonial:
          "Being connected to Petrosia's network gives me access to pets from across India. My customers appreciate the variety, and I appreciate the additional income from consumables sales. The 5% commission structure is very fair."
      },
      {
        name: "Lakshmi Venkatesh",
        testimonial:
          "I started as a small pet grooming service and expanded to a full franchise with Petrosia. The zero setup fees meant I could invest in better facilities instead. Now I have a thriving business with loyal customers."
      },
    ],
    jaipur: [
      {
        name: "Vikram Singh",
        testimonial:
          "The pet market in Jaipur was underserved until I opened my Petrosia franchise. With their help sourcing pets from other regions, I've been able to offer breeds previously unavailable here. The business has grown 300% in just one year."
      },
      {
        name: "Sheetal Rathore",
        testimonial:
          "I love that Petrosia cares about ethical pet sourcing. As a franchise owner, I can confidently tell my customers about the origins and health status of every pet. This transparency, combined with the additional revenue from pet supplies, has made my business very successful."
      },
    ],
  };

  // City statistics
  const cityStats = {
    mumbai: [
      { label: "Active Franchises", value: "14" },
      { label: "Avg. Monthly Sales", value: "₹4.2L" },
      { label: "Market Potential", value: "High" },
    ],
    bangalore: [
      { label: "Active Franchises", value: "11" },
      { label: "Avg. Monthly Sales", value: "₹3.8L" },
      { label: "Market Potential", value: "Very High" },
    ],
    chennai: [
      { label: "Active Franchises", value: "8" },
      { label: "Avg. Monthly Sales", value: "₹3.5L" },
      { label: "Market Potential", value: "High" },
    ],
    jaipur: [
      { label: "Active Franchises", value: "5" },
      { label: "Avg. Monthly Sales", value: "₹2.9L" },
      { label: "Market Potential", value: "Growing" },
    ],
  };

  // City descriptions
  const cityDescriptions = {
    mumbai:
      "Mumbai represents our largest franchise market with growing demand for premium pet services. The city's dense population and increasing pet ownership rates make it an ideal location for new franchise owners.",
    bangalore:
      "Bangalore's tech-savvy population has embraced pet ownership at an unprecedented rate. Our franchises here see high engagement with digital services and premium pet products.",
    chennai:
      "Chennai offers excellent opportunities for pet franchises, with a strong focus on personalized service. Our franchisees here report high customer loyalty and recurring business.",
    jaipur:
      "Jaipur is one of our fastest-growing markets with significant untapped potential. Early franchise owners have established strong positions in this emerging pet-friendly city.",
  };

  return (
    <>
      <Helmet>
        <title>Franchise Opportunities | Petrosia</title>
        <meta
          name="description"
          content="Join the Petrosia franchise network and build a thriving pet business with zero setup fees, built-in customer base, and continuous support."
        />
      </Helmet>

      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Petrosia Franchise Opportunities</h1>
            <p className="text-xl text-muted-foreground">
              Join India's fastest-growing pet marketplace network
            </p>
          </div>

          {/* Hero section */}
          <div className="relative rounded-lg overflow-hidden mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/30 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Pet shop"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
              <div className="max-w-2xl text-center text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Build Your Dream Pet Business
                </h2>
                <p className="text-lg mb-6">
                  Become a Petrosia franchise partner with zero setup fees and instant access to our growing customer base.
                </p>
                <a 
                href={`https://wa.me/9887805771?text=${encodeURIComponent("Hi, I'm interested in becoming a Petrosia franchise partner. Could you please provide more information?")}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Apply Now
                </Button>
              </a>
              </div>
            </div>
          </div>

          {/* Key Benefits Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Key Franchise Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Zero Setup Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Unlike traditional franchises, Petrosia charges no initial setup or franchise fees. Your investment goes directly into growing your business.
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Ready Customer Pool</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Gain immediate access to our established customer base in your area. We direct local inquiries straight to your business via our integrated platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Wide Pet Sourcing Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Access pets from across India through our nationwide network. Offer rare and in-demand breeds that would otherwise be unavailable in your local market.
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Additional Revenue Streams</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Increase your sales of pet supplies, accessories, food, and medications through our referral system. All customer inquiries for pets also include prompts for essentials.
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>5% Commission Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Earn a 5% commission on every pet sale facilitated by Petrosia through your franchise. This creates a sustainable passive income stream alongside your direct sales.
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>WhatsApp Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our platform automatically redirects customer inquiries to your WhatsApp business number, allowing for personalized service and higher conversion rates.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">For Local Direct Sales</h3>
                <ol className="space-y-3 list-decimal pl-5">
                  <li>You maintain your own inventory of pets and supplies</li>
                  <li>Customers discover you through the Petrosia platform</li>
                  <li>Inquiries are directed to your WhatsApp business line</li>
                  <li>You complete sales and build your local customer base</li>
                  <li>Benefit from Petrosia's marketing and brand reputation</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">For Petrosia-Facilitated Sales</h3>
                <ol className="space-y-3 list-decimal pl-5">
                  <li>Customers seek pets not available in your inventory</li>
                  <li>Petrosia sources the pet from our nationwide network</li>
                  <li>You facilitate the local delivery and customer service</li>
                  <li>You earn 5% commission on the sale value</li>
                  <li>You gain a new customer for ongoing supply sales</li>
                </ol>
              </div>
            </div>

            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Illustrative Example</h3>
              <p className="mb-4">
                <strong>Scenario:</strong> A customer in Bangalore wants a rare Samoyed puppy not commonly available locally.
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>The customer finds Petrosia and inquires about the breed</li>
                <li>Petrosia identifies your franchise as the local partner</li>
                <li>Petrosia sources the puppy from our breeder network in Himachal Pradesh</li>
                <li>The puppy (priced at ₹85,000) is delivered to your location</li>
                <li>You manage the customer relationship and handover</li>
                <li>You earn ₹4,250 (5% commission) for minimal work</li>
                <li>You sell the new pet owner food, toys, bedding, and grooming supplies worth ₹12,000</li>
                <li>The customer returns to you for all future pet needs</li>
              </ul>
              <p className="mt-4 font-medium">
                Total earnings: ₹16,250+ from a single connection, plus ongoing customer value
              </p>
            </div>
          </section>

          {/* City-specific section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Franchise Opportunities By City
            </h2>

            <Tabs defaultValue="mumbai" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="mumbai">Mumbai</TabsTrigger>
                <TabsTrigger value="bangalore">Bangalore</TabsTrigger>
                <TabsTrigger value="chennai">Chennai</TabsTrigger>
                <TabsTrigger value="jaipur">Jaipur</TabsTrigger>
              </TabsList>

              <CitySection
                city="Mumbai"
                description={cityDescriptions.mumbai}
                stats={cityStats.mumbai}
                franchisees={franchiseOwners.mumbai}
              />

              <CitySection
                city="Bangalore"
                description={cityDescriptions.bangalore}
                stats={cityStats.bangalore}
                franchisees={franchiseOwners.bangalore}
              />

              <CitySection
                city="Chennai"
                description={cityDescriptions.chennai}
                stats={cityStats.chennai}
                franchisees={franchiseOwners.chennai}
              />

              <CitySection
                city="Jaipur"
                description={cityDescriptions.jaipur}
                stats={cityStats.jaipur}
                franchisees={franchiseOwners.jaipur}
              />
            </Tabs>
          </section>

          {/* Franchise Policies Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Franchise Policies</h2>
            <div className="bg-muted p-6 rounded-lg mb-8">
              <p className="italic text-sm text-center mb-4">
                "Our flexible policies are designed to support your entrepreneurial success while maintaining the Petrosia brand standard of excellence."
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Flexible Operating Requirements</h3>
                <p className="mb-3">
                  While we don't dictate your business hours or staffing requirements, Petrosia franchisees must commit to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Responding to all customer inquiries within <strong>2 hours</strong> during business hours</li>
                  <li>Maintaining a <strong>minimum 85% customer satisfaction rating</strong> based on Petrosia's rating system</li>
                  <li>Processing all Petrosia-facilitated pet deliveries within <strong>24 hours</strong> of arrival</li>
                  <li>Sharing all customer data and contact information with Petrosia's central database</li>
                  <li>Adhering to Petrosia's quality and ethical sourcing standards for all pets sold</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Limited Exclusivity Agreement</h3>
                <p className="mb-3">
                  We offer flexible territorial rights that adapt to your business growth:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Initial non-exclusive rights to your operation area</li>
                  <li>Opportunity to earn exclusive territorial rights after meeting sales targets for 12 consecutive months</li>
                  <li>First right of refusal for neighboring territories</li>
                  <li><strong>All pet sales in your area through Petrosia's platform must be fulfilled by your franchise</strong></li>
                  <li>Mandatory acceptance of all Petrosia-facilitated sales in your territory</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Commission Structure & Payments</h3>
                <p className="mb-3">
                  Our commission-based model ensures alignment of interests:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>0% franchise fee, but 10% of your direct sales revenue is contributed to Petrosia's marketing fund</strong></li>
                  <li>5% commission on Petrosia-facilitated pet sales</li>
                  <li>Monthly sales data reports must be submitted by the 3rd of each month</li>
                  <li>All payments processed through Petrosia's payment gateway with a 3.5% transaction fee</li>
                  <li>Minimum monthly sales quota based on your city's market potential</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Brand Standards Compliance</h3>
                <p className="mb-3">
                  While you operate your business independently, certain brand standards must be maintained:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Store layout and signage must comply with Petrosia's visual identity guidelines</li>
                  <li>Exclusive use of Petrosia-approved vendors for uniforms, packaging, and marketing materials</li>
                  <li>Quarterly compliance inspections with <strong>24-hour notice</strong></li>
                  <li>Mandatory participation in all Petrosia promotional campaigns</li>
                  <li>Required attendance at bi-annual franchise meetings (in-person or virtual)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Termination & Renewal Terms</h3>
                <p className="mb-3">
                  Our partnership approach offers simple renewal terms:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Initial agreement term of 3 years</li>
                  <li>Automatic renewal if all performance metrics are met</li>
                  <li><strong>Petrosia reserves the right to terminate the franchise agreement with 30 days notice if performance metrics are not maintained for 2 consecutive quarters</strong></li>
                  <li>Upon termination, all customer data remains the property of Petrosia</li>
                  <li>Non-compete clause prohibits operating a similar pet business within 10km for 2 years after termination</li>
                </ul>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                <h3 className="text-xl font-semibold mb-3 text-primary">Franchise Success Program</h3>
                <p className="mb-3">
                  We're committed to your success and provide these additional benefits:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Comprehensive 2-week training program at our headquarters (travel expenses not included)</li>
                  <li>Dedicated franchise success manager for your first 90 days</li>
                  <li>Access to proprietary pet care knowledge base and training materials</li>
                  <li>Inclusion in national marketing campaigns</li>
                  <li>Opportunity to participate in Petrosia's pet breeding program (subject to qualification)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the Petrosia franchise network today and build a thriving pet business with our support. Zero startup fees means you can begin your journey immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`https://wa.me/9887805771?text=${encodeURIComponent("Hi, I'm interested in becoming a Petrosia franchise partner. Could you please provide more information?")}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg">Apply for Franchise</Button>
              </a>
              <Button size="lg" variant="outline">
                Download Information Packet
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default FranchisePage;