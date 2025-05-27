import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Hero2 from "@/components/home/Hero2";
import UserRoleSelection from "@/components/home/UserRoleSelection";
import FeaturedListings from "@/components/home/FeaturedListings";
import AdoptionSection from "@/components/home/AdoptionSection";
import PetCareSection from "@/components/home/PetCareSection";
import SellerCTA from "@/components/home/SellerCTA";
import Testimonials from "@/components/home/Testimonials";
import PetCategories from "@/components/home/PetCategories";
import PetServices from "@/components/home/PetServices";
import PetEvents from "@/components/home/PetEvents";
import NewsSection from "@/components/home/NewsSection";
import SeoTags from "@/components/common/SeoTags";
// Development component removed from frontend
// import TestOptimizedImage from "@/components/common/TestOptimizedImage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCityByName, getAllCities } from "@/lib/city-data";

/**
 * Enhanced HomePage component with city-specific SEO
 * Includes schema.org structured data and optimized meta tags
 */
const HomePage = () => {
  // Get URL parameters
  const [location] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const cityParam = urlParams.get('city');

  // State for selected city
  const [selectedCity, setSelectedCity] = useState<string>(cityParam || 'all');

  // Get city data if a city is selected
  const cityData = selectedCity !== 'all' ? getCityByName(selectedCity) : undefined;
  const cities = getAllCities().map(city => city.name);

  // When city changes, update URL without refreshing page
  useEffect(() => {
    if (selectedCity && selectedCity !== 'all') {
      const newUrl = `${window.location.pathname}?city=${selectedCity.toLowerCase()}`;
      window.history.replaceState({}, '', newUrl);
    } else {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [selectedCity]);

  // SEO optimization: Generate city-specific meta title and description
  const getTitle = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `Petrosia - Premier Pet Care Services in ${selectedCity}`;
    }
    return "Petrosia - India's most trusted pet marketplace"; //Updated text
  };

  const getDescription = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `Trusted pet care in ${selectedCity}: pet boarding, grooming, vet visits. Find your perfect furry companion and quality pet services in ${selectedCity}. Book now!`;
    }
    return "Find your perfect furry companion on Petrosia - India's trusted platform connecting pet lovers with responsible breeders, adoption centers, and quality pet services across major Indian cities.";
  };

  const getKeywords = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `pet care ${selectedCity}, pet boarding ${selectedCity}, dog grooming ${selectedCity}, home vet visit ${selectedCity}, pet walking service ${selectedCity}, pet daycare ${selectedCity}, pet adoption ${selectedCity}, dog breeders ${selectedCity}, cat breeders ${selectedCity}, pet services ${selectedCity}`;
    }
    return "pet adoption India, dog breeders, cat breeders, pet services, pet grooming, pet walking, pet boarding, pet daycare, veterinary services, Delhi, Mumbai, Bangalore, Kolkata, Chennai, Pune, Ahmedabad";
  };

  const getCanonicalUrl = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `https://petrosia.in?city=${selectedCity.toLowerCase()}`;
    }
    return "https://petrosia.in";
  };

  return (
    <>
      {/* Enhanced SEO Tags with city-specific info and structured data */}
      <SeoTags 
        title={getTitle()}
        description={getDescription()}
        keywords={getKeywords()}
        url={getCanonicalUrl()}
        image="https://petrosia.in/images/social-share-image.jpg"
        city={selectedCity !== 'all' ? selectedCity : ''}
        schemaType="LocalBusiness"
        serviceName={selectedCity !== 'all' ? `Petrosia Pet Care Services in ${selectedCity}` : 'Petrosia Pet Care Services'}
        serviceDescription={getDescription()}
        servicePriceRange="₹500 - ₹2,500"
      />

      {/* Main content sections */}
      <Hero2 />

      {/* City-specific heading for SEO */}
      {selectedCity !== 'all' && (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Petrosia: Premier Pet Care in {selectedCity}
          </h1>
          <p className="text-center max-w-3xl mx-auto text-muted-foreground mb-8">
            We offer comprehensive pet services in {selectedCity} including safe pet boarding, professional dog grooming, 
            home vet visits, reliable pet walking, and premium daycare facilities. 
            All our services in {selectedCity} are provided by trained professionals who prioritize your pet's health and happiness.
          </p>
        </div>
      )}

      <PetCategories />
      <FeaturedListings />

      {/* City-specific service heading for SEO */}
      {selectedCity !== 'all' && (
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-2xl font-bold text-center mb-4">
            Our Pet Care Services in {selectedCity}
          </h2>
        </div>
      )}

      <PetServices />
      <PetEvents />
      <AdoptionSection />
      <NewsSection />
      <UserRoleSelection />
      <SellerCTA />
      <Testimonials />

      {/* City-specific FAQ section for SEO */}
      {selectedCity !== 'all' && (
        <div className="container mx-auto px-4 py-12 bg-muted/30">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions About Pet Care in {selectedCity}
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">What pet services does Petrosia offer in {selectedCity}?</h3>
              <p className="text-muted-foreground">
                Petrosia offers a comprehensive range of pet services in {selectedCity} including pet boarding, dog training, 
                professional grooming, home vet visits, reliable pet walking, and premium daycare facilities. All our services 
                in {selectedCity} are provided by trained professionals who prioritize your pet's health and happiness.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">How much does pet boarding cost in {selectedCity}?</h3>
              <p className="text-muted-foreground">
                Our pet boarding services in {selectedCity} are available at ₹2,500/day for AC facilities and ₹1,800/day for non-AC options. 
                All boarding includes daily walks, proper nutrition, and professional care from our experienced staff in {selectedCity}.
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">Do you offer emergency vet services in {selectedCity}?</h3>
              <p className="text-muted-foreground">
                Yes, Petrosia provides emergency home vet visits in {selectedCity} for ₹500. Our qualified veterinarians in {selectedCity} 
                can address urgent medical needs, provide routine check-ups, and administer vaccinations in the comfort of your home.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Development component removed from frontend 
      <TestOptimizedImage /> */}

      {/* Moved city selector to the bottom */}
      <div className="bg-muted py-2">
        <div className="container mx-auto flex justify-center px-4"> {/* Changed justify-end to justify-center */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Select City:</span>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All India</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;