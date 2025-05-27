import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  Clock, 
  Dog as DogIcon, 
  PawPrint, 
  Shield, 
  Heart, 
  Utensils, 
  Phone
} from "lucide-react";
import SeoTags from "@/components/common/SeoTags";
import { getAllCities, getCityByName, SERVICE_PRICE_RANGES } from "@/lib/city-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Pet Boarding Service Page optimized for SEO
 * Includes city-specific content, schema.org markup, and proper heading structure
 */
const PetBoardingPage = () => {
  // Get URL parameters for city
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const cityParam = urlParams.get('city')?.toLowerCase();
  
  // State for selected city
  const [selectedCity, setSelectedCity] = useState<string>(cityParam || 'all');
  
  // Get city data
  const cityData = selectedCity !== 'all' ? getCityByName(selectedCity) : undefined;
  const cities = getAllCities()
    .filter(city => city.services.petBoarding)
    .map(city => city.name);
  
  // When city changes, update URL without refreshing page
  useEffect(() => {
    if (selectedCity && selectedCity !== 'all') {
      const newUrl = `${window.location.pathname}?city=${selectedCity.toLowerCase()}`;
      window.history.replaceState({}, '', newUrl);
    } else {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [selectedCity]);
  
  // Handle booking button click
  const handleBooking = () => {
    // Direct to WhatsApp with pre-filled message including city
    const cityText = selectedCity !== 'all' ? ` in ${selectedCity}` : '';
    const message = `Hello, I'm interested in pet boarding services${cityText}. Please share more details.`;
    window.open(`https://wa.me/919887805771?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  // SEO optimization: Generate city-specific meta tags
  const getTitle = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `Pet Boarding in ${selectedCity} | Petrosia`;
    }
    return "Pet Boarding Services in India | Petrosia";
  };
  
  const getDescription = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `Safe pet boarding in ${selectedCity} with 24/7 care, daily walks, and proper nutrition. AC and non-AC options available from ₹1,800/day. Book your pet's stay with Petrosia!`;
    }
    return "Professional pet boarding services across major Indian cities with 24/7 care, daily walks, and proper nutrition. Find safe, comfortable accommodations for your beloved pets while you're away.";
  };
  
  const getKeywords = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `pet boarding ${selectedCity}, dog boarding ${selectedCity}, cat boarding ${selectedCity}, pet hostel ${selectedCity}, safe pet boarding ${selectedCity}, pet hotel ${selectedCity}, pet care while traveling ${selectedCity}, dog daycare ${selectedCity}`;
    }
    return "pet boarding India, dog boarding, cat boarding, pet hostel, pet hotel India, safe pet boarding, luxury pet boarding, pet care while traveling, dog daycare";
  };
  
  const getCanonicalUrl = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `https://petrosia.in/pet-boarding?city=${selectedCity.toLowerCase()}`;
    }
    return "https://petrosia.in/pet-boarding";
  };

  return (
    <>
      {/* SEO-optimized tags with structured data */}
      <SeoTags 
        title={getTitle()}
        description={getDescription()}
        keywords={getKeywords()}
        url={getCanonicalUrl()}
        image="https://petrosia.in/images/services/pet-boarding.jpg"
        city={selectedCity !== 'all' ? selectedCity : ''}
        schemaType="Service"
        serviceName={selectedCity !== 'all' ? `Pet Boarding in ${selectedCity}` : 'Pet Boarding Services'}
        serviceDescription={getDescription()}
        servicePriceRange={SERVICE_PRICE_RANGES.petBoarding}
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {/* SEO-optimized H1 with city name */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {selectedCity !== 'all' 
                  ? `Pet Boarding in ${selectedCity}` 
                  : "Professional Pet Boarding Services"
                }
              </h1>
              
              {/* SEO-rich description with keywords */}
              <p className="text-xl mb-6">
                {selectedCity !== 'all'
                  ? `Trusted pet boarding facilities in ${selectedCity} providing 24/7 care, daily walks, and proper nutrition for your beloved pets while you're away.`
                  : "We provide safe and comfortable accommodations for your pets with 24/7 supervision, daily exercise, and proper nutrition."
                }
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge className="bg-white text-blue-700 hover:bg-blue-50">24/7 Monitoring</Badge>
                <Badge className="bg-white text-blue-700 hover:bg-blue-50">Daily Exercise</Badge>
                <Badge className="bg-white text-blue-700 hover:bg-blue-50">Quality Nutrition</Badge>
                <Badge className="bg-white text-blue-700 hover:bg-blue-50">Spacious Kennels</Badge>
                <Badge className="bg-white text-blue-700 hover:bg-blue-50">Veterinary Access</Badge>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={handleBooking} className="bg-orange-500 hover:bg-orange-600">
                  Book Now
                </Button>
                
                <a href="tel:+919887805771">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Us
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="hidden md:block">
              <img 
                src="/images/services/pet-boarding-hero.jpg" 
                alt={selectedCity !== 'all' 
                  ? `Pet boarding facility in ${selectedCity}` 
                  : "Professional pet boarding facility"
                } 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* City Selector */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Find Pet Boarding Services</h2>
            
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
      </div>
      
      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        {/* SEO-optimized H2 with city name */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          {selectedCity !== 'all' 
            ? `Why Choose Our Pet Boarding in ${selectedCity}` 
            : "Why Choose Our Pet Boarding Services"
          }
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader className="pb-2">
              <Shield className="h-12 w-12 mb-2 text-blue-600" />
              <CardTitle>Safe & Secure Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {selectedCity !== 'all'
                  ? `Our ${selectedCity} facility features 24/7 monitoring, secure enclosures, and trained staff to ensure your pet's safety.`
                  : "All our facilities feature 24/7 monitoring, secure enclosures, and trained staff to ensure your pet's safety."
                }
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <PawPrint className="h-12 w-12 mb-2 text-blue-600" />
              <CardTitle>Regular Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your pets enjoy scheduled playtime and walks to maintain their physical and mental well-being during their stay.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <Utensils className="h-12 w-12 mb-2 text-blue-600" />
              <CardTitle>Quality Nutrition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We provide premium pet food with specialized diets available for pets with specific nutritional requirements.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <Heart className="h-12 w-12 mb-2 text-blue-600" />
              <CardTitle>Personal Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our caretakers give individual attention to each pet, ensuring they receive love and care while away from home.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Services & Pricing */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            {selectedCity !== 'all' 
              ? `Pet Boarding Options in ${selectedCity}` 
              : "Our Pet Boarding Options"
            }
          </h2>
          
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            {selectedCity !== 'all'
              ? `Choose from our range of comfortable and safe pet boarding options in ${selectedCity}, tailored to meet your pet's specific needs.`
              : "Choose from our range of comfortable and safe pet boarding options, tailored to meet your pet's specific needs."
            }
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-blue-500">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Standard Boarding</span>
                  <Badge>From ₹1,800/day</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <DogIcon className="h-5 w-5 text-blue-600" />
                    <span>Comfortable kennel space</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                    <span>2 walks daily</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-blue-600" />
                    <span>Regular feeding schedule</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>24/7 supervision</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6" variant="outline" onClick={handleBooking}>
                  Book Standard
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-orange-500 shadow-lg relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <Badge className="bg-orange-500">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Premium Boarding</span>
                  <Badge>From ₹2,200/day</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <DogIcon className="h-5 w-5 text-orange-600" />
                    <span>Spacious air-conditioned kennel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-orange-600" />
                    <span>3 walks daily + playtime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-orange-600" />
                    <span>Premium food + treats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span>24/7 personalized attention</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600" onClick={handleBooking}>
                  Book Premium
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-purple-500">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Luxury Suite</span>
                  <Badge>From ₹2,500/day</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <DogIcon className="h-5 w-5 text-purple-600" />
                    <span>Private suite with bedding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-purple-600" />
                    <span>4+ walks & extended play</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-purple-600" />
                    <span>Custom meal preparation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span>Dedicated pet attendant</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-6" variant="outline" onClick={handleBooking}>
                  Book Luxury
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* FAQ Section for SEO */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          {selectedCity !== 'all' 
            ? `Frequently Asked Questions About Pet Boarding in ${selectedCity}` 
            : "Frequently Asked Questions About Pet Boarding"
          }
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="border-b pb-6">
            <h3 className="text-xl font-medium mb-2">
              {selectedCity !== 'all'
                ? `What is included in pet boarding at your ${selectedCity} facility?`
                : "What is included in your pet boarding service?"
              }
            </h3>
            <p className="text-muted-foreground">
              Our pet boarding service includes comfortable accommodations, regular feeding according to your pet's diet, 
              daily exercise and walks, 24/7 supervision by trained staff, basic grooming, and administration of any 
              required medications. Premium and luxury options include additional amenities such as more spacious quarters, 
              additional playtime, and personalized attention.
            </p>
          </div>
          
          <div className="border-b pb-6">
            <h3 className="text-xl font-medium mb-2">How long can my pet stay at your boarding facility?</h3>
            <p className="text-muted-foreground">
              We offer flexible boarding periods from overnight stays to extended boarding for several weeks or months. 
              We recommend a minimum 2-night stay to allow your pet to adjust to the new environment. For longer stays, 
              we provide special long-term care packages with additional benefits and discounted rates.
            </p>
          </div>
          
          <div className="border-b pb-6">
            <h3 className="text-xl font-medium mb-2">What health requirements are there for pet boarding?</h3>
            <p className="text-muted-foreground">
              All pets must be up-to-date on core vaccinations (including rabies, DHPP for dogs and FVRCP for cats). 
              We require proof of vaccination before check-in. Pets should be free of contagious diseases and parasites. 
              We recommend a veterinary check-up before boarding for stays longer than two weeks.
            </p>
          </div>
          
          <div className="border-b pb-6">
            <h3 className="text-xl font-medium mb-2">
              {selectedCity !== 'all'
                ? `Do you provide special accommodations for senior pets in ${selectedCity}?`
                : "Do you provide special accommodations for senior pets?"
              }
            </h3>
            <p className="text-muted-foreground">
              Yes, we offer specialized care for senior pets including orthopedic bedding, assistance with mobility, 
              more frequent bathroom breaks, and closer monitoring of health conditions. Our staff is trained to 
              recognize and address the unique needs of older pets, and we can administer medications according to 
              your veterinarian's instructions.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-2">How do I book pet boarding services?</h3>
            <p className="text-muted-foreground">
              You can book our pet boarding services by:
              <br />• Calling us directly at +91-9887805771
              <br />• Using the "Book Now" button on our website
              <br />• Messaging us on WhatsApp
              <br />• Visiting our facility in person
              <br />
              We recommend booking at least 1-2 weeks in advance, especially during peak holiday seasons.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {selectedCity !== 'all'
              ? `Ready to Book Pet Boarding in ${selectedCity}?`
              : "Ready to Book Pet Boarding For Your Furry Friend?"
            }
          </h2>
          
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            Give your pet the care they deserve while you're away. Our professional boarding services ensure 
            your pet remains happy, healthy, and safe until you return.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={handleBooking} className="bg-white text-blue-600 hover:bg-blue-50">
              Book Now
            </Button>
            
            <a href="tel:+919887805771">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <Phone className="mr-2 h-5 w-5" />
                Call Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetBoardingPage;