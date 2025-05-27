import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { format } from "date-fns";
import { 
  ChevronRight, 
  User, 
  Calendar, 
  Tag, 
  Share2, 
  Copy, 
  Facebook, 
  Twitter as X, 
  Linkedin, 
  PawPrint,
  DogIcon,
  CheckCircle,
  AlertCircle,
  BookCheck,
  Clock,
  Heart,
  Phone,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getAllCities, getCityByName } from "@/lib/city-data";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SeoTags from "@/components/common/SeoTags";
import { useGeolocation } from "@/hooks/use-geolocation";

/**
 * SEO-optimized Blog Post about Pet Boarding with city-specific content
 * Includes structured data and proper heading hierarchy
 */
const PetBoardingGuidePage = () => {
  // Get URL parameters for city
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const cityParam = urlParams.get('city')?.toLowerCase();
  
  // Toast for sharing
  const { toast } = useToast();
  
  // Use geolocation to detect user's city
  const { detectedCity, isLoading: isLoadingGeo } = useGeolocation();
  
  // State for selected city
  const [selectedCity, setSelectedCity] = useState<string>(cityParam || 'all');
  const [shareUrl, setShareUrl] = useState("");
  
  // Get city data
  const cityData = selectedCity !== 'all' ? getCityByName(selectedCity) : undefined;
  const cities = getAllCities()
    .filter(city => city.services.petBoarding)
    .map(city => city.name);
    
  // Set city based on geolocation if no city is selected
  useEffect(() => {
    if (detectedCity && selectedCity === 'all' && !cityParam) {
      setSelectedCity(detectedCity);
    }
  }, [detectedCity, selectedCity, cityParam]);
  
  // When city changes, update URL without refreshing page
  useEffect(() => {
    if (selectedCity && selectedCity !== 'all') {
      const newUrl = `${window.location.pathname}?city=${selectedCity.toLowerCase()}`;
      window.history.replaceState({}, '', newUrl);
      setShareUrl(window.location.origin + newUrl);
    } else {
      window.history.replaceState({}, '', window.location.pathname);
      setShareUrl(window.location.origin + window.location.pathname);
    }
  }, [selectedCity]);
  
  // Handle booking button click
  const handleBooking = () => {
    // Direct to WhatsApp with pre-filled message including city
    const cityText = selectedCity !== 'all' ? ` in ${selectedCity}` : '';
    const message = `Hello, I read your guide on pet boarding${cityText} and I'm interested in your services. Can you provide more details?`;
    window.open(`https://wa.me/919887805771?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  // Handle copy link button
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "Article link copied to clipboard",
    });
  };
  
  // Article publication date for SEO
  const publishDate = "2025-04-20T10:00:00Z";
  const formattedDate = format(new Date(publishDate), "MMMM d, yyyy");
  const modifiedDate = "2025-04-27T09:30:00Z";
  
  // SEO optimization: Generate city-specific meta title and description
  const getTitle = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `How to Choose Pet Boarding in ${selectedCity} | Petrosia`;
    }
    return "How to Choose the Right Pet Boarding Service in India | Petrosia";
  };
  
  const getDescription = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `Find safe pet boarding in ${selectedCity} with our comprehensive guide. Top tips for selecting the best boarding facility for dogs and cats in ${selectedCity}. Book now!`;
    }
    return "Comprehensive guide to choosing the right pet boarding services across India. Learn what to look for in facilities, questions to ask, and how to prepare your pet for boarding.";
  };
  
  const getKeywords = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `pet boarding ${selectedCity}, choose pet boarding ${selectedCity}, dog boarding guide ${selectedCity}, safe pet boarding ${selectedCity}, cat boarding ${selectedCity}, pet care tips ${selectedCity}, pet boarding checklist ${selectedCity}`;
    }
    return "pet boarding India, choose pet boarding, dog boarding guide, safe pet boarding, cat boarding, pet care tips, pet boarding checklist, prepare pet for boarding";
  };
  
  const getCanonicalUrl = () => {
    if (selectedCity && selectedCity !== 'all') {
      return `https://petrosia.in/blog/pet-boarding-guide?city=${selectedCity.toLowerCase()}`;
    }
    return "https://petrosia.in/blog/pet-boarding-guide";
  };
  
  return (
    <>
      {/* SEO-optimized tags with structured data */}
      <SeoTags 
        title={getTitle()}
        description={getDescription()}
        keywords={getKeywords()}
        url={getCanonicalUrl()}
        image="https://petrosia.in/images/blog/pet-boarding-guide.jpg"
        city={selectedCity !== 'all' ? selectedCity : ''}
        schemaType="BlogPosting"
        articlePublishedDate={publishDate}
        articleModifiedDate={modifiedDate}
        articleAuthor="Petrosia Pet Care Experts"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs for SEO */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">Pet Boarding Guide</span>
        </div>
        
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            {/* SEO-optimized H1 with city name */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {selectedCity !== 'all' 
                ? `How to Choose Pet Boarding in ${selectedCity}` 
                : "How to Choose the Right Pet Boarding Service"
              }
            </h1>
            
            {/* Display detected city notification when geolocation is used */}
            {detectedCity && selectedCity === detectedCity && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-primary/10 mb-4">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="text-sm">
                  <span className="font-medium">Showing content for {detectedCity}</span> based on your location.
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>PE</AvatarFallback>
                </Avatar>
                <span className="text-sm">Petrosia Pet Care Experts</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-border"></div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{formattedDate}</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-border"></div>
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  <Badge key="pet-boarding" variant="outline" className="text-xs">
                    Pet Boarding
                  </Badge>
                  <Badge key="pet-care" variant="outline" className="text-xs">
                    Pet Care
                  </Badge>
                  {selectedCity !== 'all' && (
                    <Badge key="city" variant="outline" className="text-xs">
                      {selectedCity}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden mb-8">
              <img 
                src="/images/blog/pet-boarding-guide.jpg" 
                alt={selectedCity !== 'all' 
                  ? `Pet boarding facility in ${selectedCity}` 
                  : "Professional pet boarding facility"
                } 
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          </header>
          
          <div className="prose prose-lg max-w-none mb-10">
            {/* Introduction with city-specific keywords */}
            <p>
              {selectedCity !== 'all'
                ? `Finding the right pet boarding facility in ${selectedCity} can be a challenging task for pet parents. 
                   Whether you're planning a vacation, business trip, or home renovation, knowing your beloved pet is 
                   in safe hands while you're away is essential for your peace of mind. ${selectedCity} offers several 
                   pet boarding options, but how do you choose the best one for your furry family member?`
                : `Finding the right pet boarding facility can be a challenging task for pet parents. 
                   Whether you're planning a vacation, business trip, or home renovation, knowing your beloved pet is 
                   in safe hands while you're away is essential for your peace of mind. India offers many 
                   pet boarding options, but how do you choose the best one for your furry family member?`
              }
            </p>
            
            <p>
              This comprehensive guide will walk you through everything you need to know about selecting a safe, 
              comfortable, and reputable pet boarding service{selectedCity !== 'all' ? ` in ${selectedCity}` : ''}.
            </p>
            
            {/* Benefits section with SEO-optimized H2 */}
            <h2>
              {selectedCity !== 'all'
                ? `Benefits of Safe Pet Boarding in ${selectedCity}`
                : "Benefits of Safe Pet Boarding"
              }
            </h2>
            
            <p>
              Before diving into selection criteria, let's understand why professional pet boarding is often a better 
              choice than leaving your pet with friends or family:
            </p>
            
            <ul>
              <li>
                <strong>24/7 Professional Supervision:</strong> Trained staff monitor pets around the clock, quickly 
                identifying any health or behavioral issues.
              </li>
              <li>
                <strong>Structured Environment:</strong> Regular feeding, exercise, and rest schedules help maintain your 
                pet's routine.
              </li>
              <li>
                <strong>Socialization Opportunities:</strong> Many facilities offer supervised play with other compatible pets.
              </li>
              <li>
                <strong>Emergency Protocols:</strong> Professional facilities have established procedures and veterinary 
                contacts for emergencies.
              </li>
              <li>
                <strong>Proper Facilities:</strong> Purpose-built spaces designed for pet safety, comfort, and hygiene.
              </li>
            </ul>
            
            {/* Essential criteria section with SEO-optimized H2 */}
            <h2>
              {selectedCity !== 'all'
                ? `Essential Criteria for Choosing Pet Boarding in ${selectedCity}`
                : "Essential Criteria for Choosing Pet Boarding"
              }
            </h2>
            
            <p>
              When evaluating pet boarding options{selectedCity !== 'all' ? ` in ${selectedCity}` : ''}, consider these 
              critical factors:
            </p>
            
            <h3>1. Facility Cleanliness and Safety</h3>
            
            <p>
              The boarding facility should be clean, well-ventilated, and free of strong odors. Look for:
            </p>
            
            <ul>
              <li>Sanitized kennels and play areas</li>
              <li>Proper waste disposal systems</li>
              <li>Secure fencing and gates</li>
              <li>Fire safety equipment</li>
              <li>Separate areas for dogs and cats</li>
              <li>Non-slip flooring to prevent injuries</li>
            </ul>
            
            <div className="not-prose bg-blue-50 p-6 rounded-lg my-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-medium text-blue-800 mb-2">Expert Tip</h4>
                  <p className="text-blue-700">
                    {selectedCity !== 'all'
                      ? `Always visit the pet boarding facility in ${selectedCity} in person before booking. Schedule a tour during 
                         regular business hours to observe the cleanliness, noise levels, and how staff interact with the animals.`
                      : `Always visit the pet boarding facility in person before booking. Schedule a tour during 
                         regular business hours to observe the cleanliness, noise levels, and how staff interact with the animals.`
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <h3>2. Staff Qualifications and Supervision</h3>
            
            <p>
              The quality of care your pet receives depends largely on the staff's expertise and attentiveness:
            </p>
            
            <ul>
              <li>Staff-to-pet ratio (ideally no more than 10-15 pets per attendant)</li>
              <li>Training in pet first aid and emergency procedures</li>
              <li>Experience handling different breeds and temperaments</li>
              <li>24/7 supervision or overnight staff presence</li>
              <li>Genuine affection and respect for animals</li>
            </ul>
            
            <h3>3. Accommodation and Exercise</h3>
            
            <p>
              Your pet's living space should be comfortable and appropriately sized:
            </p>
            
            <ul>
              <li>Kennels large enough for pets to stand, turn around, and lie down comfortably</li>
              <li>Proper bedding that's clean and washable</li>
              <li>Climate control (air conditioning in summer, heating in winter)</li>
              <li>Regular exercise schedules (at least 2-3 walks or play sessions daily for dogs)</li>
              <li>Enrichment activities to prevent boredom</li>
            </ul>
            
            <h3>4. Health and Safety Protocols</h3>
            
            <p>
              The facility should have comprehensive health policies in place:
            </p>
            
            <ul>
              <li>Vaccination requirements for all boarders</li>
              <li>Medication administration capabilities</li>
              <li>Isolation areas for sick pets</li>
              <li>Relationship with local veterinarians or on-call vet services</li>
              <li>Clear emergency protocols</li>
            </ul>
            
            {/* City-specific section for SEO */}
            {selectedCity !== 'all' && (
              <>
                <h2>{`Pet Boarding Options in ${selectedCity}`}</h2>
                
                <p>
                  {`${selectedCity} offers several pet boarding facilities ranging from basic kennels to luxury pet hotels. 
                  When choosing a pet boarding service in ${selectedCity}, consider your pet's specific needs, your budget, 
                  and the facility's proximity to your home or veterinarian.`}
                </p>
                
                <p>
                  {`Top-rated pet boarding facilities in ${selectedCity} typically offer:`}
                </p>
                
                <ul>
                  <li>Indoor and outdoor play areas</li>
                  <li>Webcam access to check on your pet remotely</li>
                  <li>Daily photo or video updates</li>
                  <li>Spacious, climate-controlled kennels</li>
                  <li>Optional grooming services</li>
                  <li>Customizable meal plans</li>
                </ul>
                
                <p>
                  {`At Petrosia, we provide comprehensive pet boarding services in ${selectedCity} with trained staff available 
                  24/7, spacious accommodations, and regular exercise for your pets. Our facilities are designed with your 
                  pet's comfort and safety in mind.`}
                </p>
              </>
            )}
            
            <h2>Preparing Your Pet for Boarding</h2>
            
            <p>
              Once you've selected the right boarding facility, here's how to prepare your pet for their stay:
            </p>
            
            <ol>
              <li>
                <strong>Update Vaccinations:</strong> Ensure all required vaccinations are current at least two weeks before boarding.
              </li>
              <li>
                <strong>Pack Familiar Items:</strong> Bring your pet's regular food, bed, toys, and perhaps an unwashed shirt with your scent.
              </li>
              <li>
                <strong>Provide Detailed Instructions:</strong> Write down feeding schedules, medication instructions, behavioral quirks, and emergency contacts.
              </li>
              <li>
                <strong>Short Practice Stays:</strong> For first-time boarders, consider a short one-night stay before longer periods.
              </li>
              <li>
                <strong>Remain Calm:</strong> Pets can sense anxiety, so maintain a positive attitude during drop-off.
              </li>
            </ol>
            
            <div className="not-prose bg-amber-50 p-6 rounded-lg my-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-medium text-amber-800 mb-2">Important Consideration</h4>
                  <p className="text-amber-700">
                    If your pet has special needs, health issues, or anxiety, discuss these in advance with the boarding facility. 
                    Some pets may require specialized care or might benefit from alternatives like in-home pet sitting.
                  </p>
                </div>
              </div>
            </div>
            
            <h2>Questions to Ask Before Booking</h2>
            
            <p>
              Before finalizing your booking{selectedCity !== 'all' ? ` at a ${selectedCity} pet boarding facility` : ''}, 
              ask these essential questions:
            </p>
            
            <ol>
              <li>What is your staff-to-pet ratio, and is someone present overnight?</li>
              <li>How do you handle pet emergencies?</li>
              <li>Can I bring my pet's regular food and belongings?</li>
              <li>How often will my pet be exercised and taken outside?</li>
              <li>What is your cleaning and sanitation protocol?</li>
              <li>How do you separate pets by size, temperament, or species?</li>
              <li>Can I receive updates about my pet during their stay?</li>
              <li>What happens if I need to extend or shorten my pet's stay?</li>
            </ol>
            
            <h2>Conclusion</h2>
            
            <p>
              Choosing the right pet boarding facility{selectedCity !== 'all' ? ` in ${selectedCity}` : ''} requires research, 
              facility visits, and careful consideration of your pet's individual needs. By focusing on cleanliness, staff 
              qualifications, accommodation quality, and health protocols, you can find a boarding option that provides 
              both you and your pet with peace of mind.
            </p>
            
            <p>
              Remember that the best pet boarding experience comes from preparation and clear communication with the 
              facility staff about your pet's needs and routines. With the right boarding choice, your time away can 
              be worry-free, knowing your pet is safe, comfortable, and well-cared for.
            </p>
            
            {/* Call-to-action for SEO */}
            <div className="not-prose bg-gradient-to-r from-blue-500 to-blue-700 p-8 rounded-lg text-white text-center my-8">
              <h3 className="text-xl font-bold mb-4">
                {selectedCity !== 'all'
                  ? `Looking for Professional Pet Boarding in ${selectedCity}?`
                  : "Looking for Professional Pet Boarding Services?"
                }
              </h3>
              
              <p className="mb-6">
                {selectedCity !== 'all'
                  ? `Petrosia offers premium pet boarding services in ${selectedCity} with 24/7 care, climate-controlled facilities, and trained staff who treat your pets like family.`
                  : "Petrosia offers premium pet boarding services across major Indian cities with 24/7 care, climate-controlled facilities, and trained staff who treat your pets like family."
                }
              </p>
              
              <Button 
                onClick={handleBooking} 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50"
              >
                Book Now
              </Button>
            </div>
          </div>
          
          {/* FAQ Section for SEO and featured snippets */}
          <div className="mb-12 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">
              {selectedCity !== 'all'
                ? `Frequently Asked Questions About Pet Boarding in ${selectedCity}`
                : "Frequently Asked Questions About Pet Boarding"
              }
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">
                  {selectedCity !== 'all'
                    ? `How much does pet boarding cost in ${selectedCity}?`
                    : "How much does pet boarding cost in India?"
                  }
                </h3>
                <p className="text-muted-foreground">
                  {selectedCity !== 'all'
                    ? `Pet boarding costs in ${selectedCity} typically range from ₹1,800 to ₹2,500 per day, depending on the type of accommodation (standard vs. luxury), pet size, and additional services. Most facilities offer discounts for extended stays or multiple pets from the same family.`
                    : "Pet boarding costs in India typically range from ₹1,000 to ₹3,000 per day, depending on the city, type of accommodation (standard vs. luxury), pet size, and additional services. Most facilities offer discounts for extended stays or multiple pets from the same family."
                  }
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">How long can my pet stay at a boarding facility?</h3>
                <p className="text-muted-foreground">
                  Most pet boarding facilities accommodate stays ranging from overnight to several weeks or even months. 
                  For longer stays, many facilities offer special packages with additional services like grooming and 
                  health check-ups. It's recommended to book a short trial stay before leaving your pet for an extended period.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">What should I bring when boarding my pet?</h3>
                <p className="text-muted-foreground">
                  Bring your pet's regular food (enough for the entire stay plus extra), any medications with clear instructions, 
                  vaccination records, your veterinarian's contact information, a familiar bed or blanket, favorite toys, and 
                  an item with your scent. Some facilities provide bedding and food, but maintaining your pet's regular diet 
                  helps prevent digestive issues.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">
                  {selectedCity !== 'all'
                    ? `Is overnight supervision available at ${selectedCity} pet boarding facilities?`
                    : "Is overnight supervision available at pet boarding facilities?"
                  }
                </h3>
                <p className="text-muted-foreground">
                  {selectedCity !== 'all'
                    ? `Quality pet boarding facilities in ${selectedCity} provide 24/7 supervision, including overnight staff or caretakers who live on-premises. Some premium facilities also offer webcam monitoring allowing you to check on your pet remotely. Always confirm the level of overnight supervision when booking.`
                    : "Quality pet boarding facilities provide 24/7 supervision, including overnight staff or caretakers who live on-premises. Some premium facilities also offer webcam monitoring allowing you to check on your pet remotely. Always confirm the level of overnight supervision when booking."
                  }
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">How do I prepare my anxious pet for boarding?</h3>
                <p className="text-muted-foreground">
                  For anxious pets, preparation is key. Visit the facility beforehand with your pet for a tour. Consider scheduling short "practice stays" of a few hours, gradually increasing to overnight. Bring items with your scent and familiar toys. Some facilities offer private spaces for anxious pets away from other animals. Discuss your pet's anxiety with staff so they can provide appropriate care and attention.
                </p>
              </div>
            </div>
          </div>
          
          {/* Social Sharing */}
          <div className="border-t pt-6 flex flex-wrap gap-4 items-center justify-between mb-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Share this article:</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(getTitle())}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
            
            <Link href="/blog" className="text-primary hover:underline font-medium flex items-center gap-1">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Blog
            </Link>
          </div>
          
          {/* Related Articles for SEO */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    <Link href="/blog/preparing-pets-for-travel" className="hover:text-primary transition-colors">
                      Preparing Your Pet for Travel: Essential Tips
                    </Link>
                  </CardTitle>
                  <CardDescription>April 15, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Learn how to make travel less stressful for your pet with these preparation tips, 
                    whether you're boarding them or taking them along.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    <Link href="/blog/separation-anxiety-pets" className="hover:text-primary transition-colors">
                      Managing Separation Anxiety in Pets
                    </Link>
                  </CardTitle>
                  <CardDescription>March 28, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Discover effective strategies to help pets cope with separation anxiety 
                    when you're away, from gradual desensitization to professional support.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* City selector moved to bottom */}
          <div className="border-t border-b py-6 my-8 border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-base font-medium">Change Location</h3>
              </div>
              
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
            
            {detectedCity && selectedCity === detectedCity && (
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <span>Based on your detected location: {detectedCity}</span>
              </div>
            )}
          </div>
          
          {/* CTA Section */}
          <div className="bg-blue-50 p-8 rounded-lg mt-8 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Need Professional Pet Boarding?</h3>
              <p className="text-muted-foreground">
                {selectedCity !== 'all'
                  ? `Book our premium pet boarding services in ${selectedCity} and enjoy peace of mind knowing your pet is in good hands.`
                  : "Book our premium pet boarding services and enjoy peace of mind knowing your pet is in good hands."
                }
              </p>
            </div>
            
            <div className="flex gap-4 flex-shrink-0">
              <Button onClick={handleBooking} className="flex-1 md:flex-auto">
                <PawPrint className="mr-2 h-5 w-5" />
                Book Now
              </Button>
              
              <a href="tel:+919887805771">
                <Button variant="outline" className="flex-1 md:flex-auto">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us
                </Button>
              </a>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default PetBoardingGuidePage;