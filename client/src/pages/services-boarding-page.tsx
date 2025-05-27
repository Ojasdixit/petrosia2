import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import MetaTags from "@/components/common/MetaTags";
import {
  Search,
  Star,
  MapPin,
  Clock,
  Bed,
  Filter,
  CheckCircle,
  ArrowRight
} from "lucide-react";

// Type definition for pet boarding facilities
type BoardingProps = {
  id: number;
  name: string;
  rating: number;
  location: string;
  city: string;
  image: string;
  hours: string;
  petTypes: string[];
  accommodations: string[];
  amenities: string[];
  priceRange: string;
  minStay: string;
};

// Mock data for pet boarding facilities
const boardings: BoardingProps[] = [
  {
    id: 1,
    name: "Royal Pet Resort & Boarding",
    rating: 4.8,
    location: "Vasant Kunj",
    city: "Delhi",
    image: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    hours: "24/7 (Check-in: 10 AM - 8 PM)",
    petTypes: ["Dogs", "Cats", "Birds"],
    accommodations: ["Luxury Suites", "Standard Kennels", "Cat Condos", "Bird Rooms"],
    amenities: ["Climate Control", "Play Areas", "Outdoor Runs", "Grooming Services", "Veterinary Support", "Webcam Access"],
    priceRange: "₹900-₹2500/night",
    minStay: "1 night"
  },
  {
    id: 2,
    name: "Whiskers & Tails Boarding",
    rating: 4.7,
    location: "Andheri West",
    city: "Mumbai",
    image: "https://images.unsplash.com/photo-1603123853880-a92a963b510c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    hours: "24/7 (Check-in: 9 AM - 7 PM)",
    petTypes: ["Dogs", "Cats"],
    accommodations: ["Premium Suites", "Standard Rooms", "Cat Towers"],
    amenities: ["Air Conditioning", "Outdoor Yards", "Grooming", "Daily Updates", "Health Monitoring"],
    priceRange: "₹1000-₹2800/night",
    minStay: "2 nights"
  },
  {
    id: 3,
    name: "Pawsome Pet Hotel",
    rating: 4.9,
    location: "Koramangala",
    city: "Bangalore",
    image: "https://images.unsplash.com/photo-1484190929067-65e7edd5a22f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    hours: "24/7 (Check-in: 8 AM - 9 PM)",
    petTypes: ["Dogs", "Cats", "Small Animals"],
    accommodations: ["Executive Suites", "Deluxe Kennels", "Feline Apartments", "Small Pet Habitats"],
    amenities: ["Temperature Control", "Swimming Pool", "Training Sessions", "Spa Treatments", "Live Cameras"],
    priceRange: "₹1200-₹3000/night",
    minStay: "1 night"
  },
  {
    id: 4,
    name: "Happy Paws Boarding",
    rating: 4.5,
    location: "Alipore",
    city: "Kolkata",
    image: "https://images.unsplash.com/photo-1556866261-8763a7662333?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    hours: "24/7 (Check-in: 10 AM - 6 PM)",
    petTypes: ["Dogs", "Cats"],
    accommodations: ["Standard Kennels", "Private Rooms", "Cat Spaces"],
    amenities: ["Indoor Play Areas", "Outdoor Runs", "Basic Grooming", "Health Monitoring"],
    priceRange: "₹800-₹1800/night",
    minStay: "2 nights"
  },
  {
    id: 5,
    name: "Furry Friends Boarding House",
    rating: 4.6,
    location: "Satellite",
    city: "Ahmedabad",
    image: "https://images.unsplash.com/photo-1582456891045-b53f97580f2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    hours: "24/7 (Check-in: 9 AM - 8 PM)",
    petTypes: ["Dogs", "Cats", "Birds"],
    accommodations: ["Standard Rooms", "Cat Cabins", "Bird Enclosures"],
    amenities: ["Climate Control", "Play Area", "Grooming", "Daily Reports"],
    priceRange: "₹700-₹1900/night",
    minStay: "1 night"
  },
  {
    id: 6,
    name: "Pet Palace Boarding",
    rating: 4.7,
    location: "Kothrud",
    city: "Pune",
    image: "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    hours: "24/7 (Check-in: 8 AM - 8 PM)",
    petTypes: ["Dogs", "Cats", "Exotic Pets"],
    accommodations: ["Luxury Kennels", "Standard Kennels", "Exotic Pet Facilities"],
    amenities: ["Pool Access", "Training Services", "Grooming", "Medical Supervision", "Photography Sessions"],
    priceRange: "₹900-₹2400/night",
    minStay: "2 nights"
  },
  {
    id: 7,
    name: "Pampered Pets Resort",
    rating: 4.8,
    location: "Adyar",
    city: "Chennai",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    hours: "24/7 (Check-in: 8 AM - 7 PM)",
    petTypes: ["Dogs", "Cats"],
    accommodations: ["VIP Suites", "Standard Rooms", "Themed Kennels"],
    amenities: ["Air Conditioning", "Agility Training", "Grooming Spa", "Swimming", "Webcam Access"],
    priceRange: "₹1000-₹2700/night",
    minStay: "1 night"
  },
  {
    id: 8,
    name: "Luxe Pet Lodge",
    rating: 4.9,
    location: "Sector 45",
    city: "Noida",
    image: "https://images.unsplash.com/photo-1550697851-920b181d8e49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    hours: "24/7 (Check-in: 9 AM - 9 PM)",
    petTypes: ["Dogs", "Cats", "Small Animals"],
    accommodations: ["Premium Suites", "Executive Kennels", "Luxury Cat Condos"],
    amenities: ["Climate Control", "Indoor Playground", "Outdoor Yards", "Gourmet Meals", "Grooming Spa", "24/7 Supervision"],
    priceRange: "₹1100-₹3200/night",
    minStay: "1 night"
  },
  {
    id: 9,
    name: "Elite Pet Boarding",
    rating: 4.8,
    location: "Sector 57",
    city: "Gurugram",
    image: "https://images.unsplash.com/photo-1607897694276-8cebdf4d5d5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    hours: "24/7 (Check-in: 8 AM - 10 PM)",
    petTypes: ["Dogs", "Cats", "Exotic Pets"],
    accommodations: ["Presidential Suites", "Deluxe Kennels", "Executive Cat Condos", "Exotic Habitats"],
    amenities: ["Premium Bedding", "Temperature Control", "Personalized Care", "Gourmet Meals", "Training", "Spa Services", "Professional Photography"],
    priceRange: "₹1500-₹4000/night",
    minStay: "1 night"
  },
  {
    id: 10,
    name: "Cozy Pet Inn",
    rating: 4.6,
    location: "Malviya Nagar",
    city: "Jaipur",
    image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80",
    hours: "24/7 (Check-in: 9 AM - 7 PM)",
    petTypes: ["Dogs", "Cats", "Birds"],
    accommodations: ["Standard Rooms", "Family Kennels", "Cat Spaces", "Bird Rooms"],
    amenities: ["Air Conditioning", "Play Areas", "Basic Grooming", "Health Monitoring"],
    priceRange: "₹800-₹2000/night",
    minStay: "2 nights"
  }
];

// Cities for filter dropdown
const cities = [
  "All Cities", "Delhi", "Mumbai", "Bangalore", "Kolkata", "Ahmedabad", 
  "Pune", "Chennai", "Noida", "Gurugram", "Jaipur", "Hyderabad", 
  "Lucknow", "Chandigarh", "Cochin"
];

export default function ServicesBoardingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  // Function to render star ratings
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  // Filter boarding facilities based on search query and selected city
  const filteredBoardings = boardings.filter(boarding => {
    const matchesSearch = boarding.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        boarding.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === "All Cities" || boarding.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  // Create WhatsApp link with prefilled message
  const createWhatsAppLink = (boardingName: string, city: string) => {
    const message = `Hi, I'm interested in your pet boarding facility at ${boardingName} in ${city}. Can you please provide more information?`;
    return `https://wa.me/9887805771?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      <MetaTags 
        title="Pet Boarding Services | Petrosia"
        description="Quality pet boarding services for when you're away. Safe, comfortable accommodations with professional care across Delhi, Mumbai, Bangalore and other major Indian cities."
        keywords="pet boarding India, dog boarding, cat boarding, pet hotel, pet sitting, overnight pet care, pet boarding Delhi, pet boarding Mumbai, pet boarding Bangalore, kennel services"
        url="https://petrosia.in/services/boarding"
        image="https://petrosia.in/images/pet-boarding-share.jpg"
      />

      {/* Main heading and search section at the top */}
      <div className="bg-gradient-to-b from-purple-50 to-white py-8 mb-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Pet Boarding Centers</h1>
          <p className="text-gray-600 max-w-2xl">
            Book pet boarding services for overnight stays. Our providers offer comfortable accommodations, regular exercise, and personalized attention for your pets.
          </p>
          
          {/* Search and filter */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-4xl">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by name, location, services..."
                className="pr-12 py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                className="absolute top-0 right-0 h-full rounded-l-none bg-purple-500 hover:bg-purple-600" 
                size="icon"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full py-6">
                <SelectValue placeholder="Filter by City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Removed "View all service providers" link since it was showing 404 errors */}
        </div>
      </div>

      {/* Boarding Facilities Section */}
      <section id="boardings" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Find Pet Boarding Facilities</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover our network of premium pet boarding facilities that provide comfortable 
            accommodations and exceptional care while you're away.
          </p>
          
          {/* Filters */}
          <div className="mb-10 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name or location"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Filter by city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Boarding Listings */}
          {filteredBoardings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBoardings.map((boarding) => (
                <Card key={`boarding-${boarding.id}`} className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <img src={boarding.image} alt={boarding.name} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2 bg-indigo-100 text-indigo-800">Min Stay: {boarding.minStay}</Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{boarding.name}</CardTitle>
                        <CardDescription>
                          {boarding.location}, {boarding.city}
                        </CardDescription>
                        <div className="flex mt-1">
                          {renderStars(boarding.rating)}
                        </div>
                      </div>
                      <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">{boarding.priceRange}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <span>{boarding.hours}</span>
                      </div>
                      <div>
                        <span className="font-medium">Accommodations:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {boarding.accommodations.map((accommodation: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-gray-50">
                              {accommodation}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Amenities:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {boarding.amenities.slice(0, 3).map((amenity: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-gray-50">
                              {amenity}
                            </Badge>
                          ))}
                          {boarding.amenities.length > 3 && (
                            <Badge variant="outline" className="bg-gray-50">
                              +{boarding.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Pet Types:</span> {boarding.petTypes.join(", ")}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <a 
                      href={createWhatsAppLink(boarding.name, boarding.city)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" 
                          alt="WhatsApp" 
                          className="w-5 h-5" 
                        />
                        Book Boarding
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <Bed className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">No boarding facilities found</h3>
              <p className="text-gray-500 max-w-lg mx-auto">
                We couldn't find any pet boarding facilities matching your search criteria. 
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Pet Parents Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg relative">
              <div className="text-4xl text-indigo-200 absolute top-4 left-4">"</div>
              <p className="text-gray-600 mb-4 relative z-10 pt-6">
                I was so worried about leaving my dog for a week-long trip, but the staff made 
                it stress-free. They sent daily updates and pictures, and my pup came home happy and healthy!
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Vikram Singh</p>
                  <p className="text-sm text-gray-500">Pet parent to Bruno</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg relative">
              <div className="text-4xl text-indigo-200 absolute top-4 left-4">"</div>
              <p className="text-gray-600 mb-4 relative z-10 pt-6">
                The luxury suite for my cat was amazing! They followed her feeding schedule 
                perfectly, and the daily video calls let me see how comfortable she was. Money well spent!
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Priya Kapoor</p>
                  <p className="text-sm text-gray-500">Pet parent to Misha</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg relative">
              <div className="text-4xl text-indigo-200 absolute top-4 left-4">"</div>
              <p className="text-gray-600 mb-4 relative z-10 pt-6">
                We've been using this boarding facility for years now. The staff remembers our 
                pets' preferences and special needs. It's like our dogs have a second family!
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Rahul & Neha Sharma</p>
                  <p className="text-sm text-gray-500">Pet parents to Leo & Luna</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Moved to the bottom */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Pet Boarding Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Supervision</h3>
              <p className="text-gray-600">
                Professional staff monitor pets around the clock, ensuring safety and immediate attention to any needs.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comfortable Accommodations</h3>
              <p className="text-gray-600">
                Spacious, clean, and climate-controlled environments designed for your pet's comfort and security.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Daily Activities</h3>
              <p className="text-gray-600">
                Structured exercise, playtime, and socialization to keep your pet happy, active, and mentally stimulated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-purple-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Planning a Trip? Book Pet Boarding Today!</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Don't wait until the last minute. Secure your pet's comfortable stay at one of our 
            premium boarding facilities and travel with peace of mind.
          </p>
          <a 
            href="https://wa.me/9887805771?text=I'm%20interested%20in%20your%20pet%20boarding%20services.%20Could%20you%20please%20provide%20more%20details?"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button className="bg-white text-indigo-700 hover:bg-indigo-50 text-lg px-8 py-4 h-auto rounded-full">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" 
                alt="WhatsApp" 
                className="w-6 h-6 mr-2" 
              />
              Contact Us on WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}