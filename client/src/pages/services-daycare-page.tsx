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
  Home,
  Filter,
  CheckCircle
} from "lucide-react";

// Type definition for pet daycare centers
type DaycareProps = {
  id: number;
  name: string;
  rating: number;
  location: string;
  city: string;
  image: string;
  hours: string;
  petTypes: string[];
  amenities: string[];
  services: string[];
  priceRange: string;
  capacity: number;
};

// Mock data for pet daycare centers
const daycares: DaycareProps[] = [
  {
    id: 1,
    name: "Paws Paradise Daycare Center",
    rating: 4.8,
    location: "Hauz Khas",
    city: "Delhi",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSqvKTRLcVp4toQV9rlIvzAWQwBnhnY5ENGx0wpvFYq1-A9wAcVFl67Agy&s=10",
    hours: "8:00 AM - 7:00 PM (Mon-Sat)",
    petTypes: ["Dogs", "Cats"],
    amenities: ["Indoor Play Area", "Outdoor Yard", "Climate Control", "Webcams", "Nap Areas", "Training Sessions"],
    services: ["Day Boarding", "Overnight Care", "Training", "Socialization", "Grooming"],
    priceRange: "₹600-₹1200/day",
    capacity: 30
  },
  {
    id: 2,
    name: "Happy Tails Daycare",
    rating: 4.6,
    location: "Bandra West",
    city: "Mumbai",
    image: "https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    hours: "7:30 AM - 8:00 PM (All days)",
    petTypes: ["Dogs", "Cats", "Small Animals"],
    amenities: ["Swimming Pool", "Agility Course", "Webcam Access", "Sleeping Quarters", "Separate Small/Large Dog Areas"],
    services: ["Full Day Care", "Half Day Care", "Pickup & Drop", "Training", "Bathing"],
    priceRange: "₹800-₹1500/day",
    capacity: 45
  },
  {
    id: 3,
    name: "Woof & Wag Daycare Center",
    rating: 4.7,
    location: "Indiranagar",
    city: "Bangalore",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    hours: "8:00 AM - 6:30 PM (Mon-Sat)",
    petTypes: ["Dogs"],
    amenities: ["Obstacle Course", "Dog Pool", "Air Conditioning", "Live Camera Feed", "Rest Areas"],
    services: ["Full Day Care", "Half Day Care", "Training Sessions", "Socialization", "Special Needs Care"],
    priceRange: "₹750-₹1400/day",
    capacity: 35
  },
  {
    id: 4,
    name: "Wagging Tails Daycare",
    rating: 4.5,
    location: "Salt Lake",
    city: "Kolkata",
    image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    hours: "8:30 AM - 7:00 PM (Mon-Sat)",
    petTypes: ["Dogs", "Cats"],
    amenities: ["Indoor Playground", "Outdoor Run", "Socialization Areas", "Supervised Play"],
    services: ["Day Boarding", "Overnight Care", "Behavioral Training", "Grooming Services"],
    priceRange: "₹500-₹1100/day",
    capacity: 25
  },
  {
    id: 5,
    name: "Purrfect Playmates",
    rating: 4.9,
    location: "Bodakdev",
    city: "Ahmedabad",
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
    hours: "9:00 AM - 6:00 PM (All days)",
    petTypes: ["Cats", "Small Dogs"],
    amenities: ["Cat Towers", "Climbing Areas", "Quiet Spaces", "Small Dog Zone", "Toys & Enrichment"],
    services: ["Day Care", "Specialized Cat Care", "Small Dog Care", "Grooming", "Veterinary Checkups"],
    priceRange: "₹600-₹1000/day",
    capacity: 20
  },
  {
    id: 6,
    name: "Pet Plaza Daycare",
    rating: 4.4,
    location: "Aundh",
    city: "Pune",
    image: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    hours: "8:00 AM - 7:00 PM (Mon-Sat)",
    petTypes: ["Dogs", "Birds", "Small Animals"],
    amenities: ["Play Areas", "Outdoor Yard", "Bird Room", "Exotic Pet Facilities"],
    services: ["Full Day Care", "Half Day Care", "Bird Boarding", "Small Animal Care"],
    priceRange: "₹550-₹1300/day",
    capacity: 40
  },
  {
    id: 7,
    name: "Pampered Paws Daycare",
    rating: 4.7,
    location: "T. Nagar",
    city: "Chennai",
    image: "https://images.unsplash.com/photo-1583511655826-05700a193ce2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    hours: "8:30 AM - 6:30 PM (Mon-Sat)",
    petTypes: ["Dogs", "Cats"],
    amenities: ["Swimming Area", "Grooming Station", "Nap Rooms", "Training Area", "Outdoor Play Yard"],
    services: ["Full Day Care", "Training & Exercise", "Pool Time", "Gourmet Meals", "Spa Services"],
    priceRange: "₹700-₹1400/day",
    capacity: 30
  },
  {
    id: 8,
    name: "Urban Pet Daycare",
    rating: 4.6,
    location: "Sector 18",
    city: "Noida",
    image: "https://images.unsplash.com/photo-1605349102932-801e7523752f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    hours: "8:00 AM - 7:30 PM (All days)",
    petTypes: ["Dogs", "Cats", "Small Animals"],
    amenities: ["Indoor Play Area", "Outdoor Yard", "Quiet Zones", "Webcam Access", "Training Facility"],
    services: ["Day Care", "Overnight Stay", "Training", "Socialization", "Pet Taxi"],
    priceRange: "₹650-₹1300/day",
    capacity: 35
  },
  {
    id: 9,
    name: "Pet Valley Daycare",
    rating: 4.8,
    location: "DLF Phase 4",
    city: "Gurugram",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    hours: "7:30 AM - 8:00 PM (All days)",
    petTypes: ["Dogs", "Cats"],
    amenities: ["Premium Play Areas", "Luxury Kennels", "Spa Services", "Video Monitoring", "Pickup & Drop"],
    services: ["Premium Day Care", "Executive Stay", "Professional Training", "Grooming", "Pet Taxi"],
    priceRange: "₹900-₹1800/day",
    capacity: 25
  },
  {
    id: 10,
    name: "Happy Pets Daycare",
    rating: 4.5,
    location: "C-Scheme",
    city: "Jaipur",
    image: "https://images.unsplash.com/photo-1557495235-340eb888a9fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    hours: "9:00 AM - 6:00 PM (Mon-Sat)",
    petTypes: ["Dogs", "Cats", "Birds"],
    amenities: ["Play Areas", "Outdoor Space", "Activity Zones", "Rest Areas"],
    services: ["Day Care", "Grooming", "Training", "Health Checkups", "Socialization"],
    priceRange: "₹500-₹1000/day",
    capacity: 30
  }
];

// Cities for filter dropdown
const cities = [
  "All Cities", "Delhi", "Mumbai", "Bangalore", "Kolkata", "Ahmedabad", 
  "Pune", "Chennai", "Noida", "Gurugram", "Jaipur", "Hyderabad", 
  "Lucknow", "Chandigarh", "Cochin"
];

export default function ServicesDaycarePage() {
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

  // Filter daycares based on search query and selected city
  const filteredDaycares = daycares.filter(daycare => {
    const matchesSearch = daycare.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        daycare.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === "All Cities" || daycare.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  // Create WhatsApp link with prefilled message
  const createWhatsAppLink = (daycareName: string, city: string) => {
    const message = `Hi, I'm interested in your pet daycare service at ${daycareName} in ${city}. Can you please provide more information?`;
    return `https://wa.me/9887805771?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      <MetaTags 
        title="Pet Daycare Services | Petrosia"
        description="Find premium pet daycare services for your furry friends across major Indian cities. Both AC and non-AC options available with trained professionals, play areas, and socialization activities."
        keywords="pet daycare India, dog daycare, cat daycare, pet boarding, AC pet daycare, pet daycare Delhi, pet daycare Mumbai, pet daycare Bangalore, pet daycare services, pet sitting"
        url="https://petrosia.in/services/daycare"
        image="https://petrosia.in/images/pet-daycare-share.jpg"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-teal-400 py-20">
        <div className="absolute inset-0 opacity-20 bg-pattern-pet-paws"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Pet Daycare Services</h1>
            <p className="text-xl text-blue-100 mb-8">
              Safe, Fun, and Caring Environment for Your Furry Family Members While You're Away
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="#daycares" className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition duration-300">
                Find Daycare Centers
              </a>
              <a 
                href="https://wa.me/9887805771?text=I%20need%20help%20finding%20the%20right%20pet%20daycare%20service.%20Can%20you%20assist?"
                target="_blank"
                rel="noopener noreferrer" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300 flex items-center justify-center gap-2"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" 
                  alt="WhatsApp" 
                  className="w-5 h-5" 
                />
                Get Personalized Help
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Pet Daycare Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Supervised Play</h3>
              <p className="text-gray-600">
                Trained professionals monitor and engage with pets, ensuring a safe and fun environment.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Socialization</h3>
              <p className="text-gray-600">
                Pets interact with others, developing essential social skills and reducing anxiety.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Exercise & Activity</h3>
              <p className="text-gray-600">
                Structured activities and play ensure your pet stays active, healthy and mentally stimulated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daycare Centers Section */}
      <section id="daycares" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Find Pet Daycare Centers</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Browse our network of professionally managed pet daycare centers that provide 
            exceptional care, attention, and fun for your furry friends.
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

          {/* Daycare Listings */}
          {filteredDaycares.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDaycares.map((daycare) => (
                <Card key={`daycare-${daycare.id}`} className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <img src={daycare.image} alt={daycare.name} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">Capacity: {daycare.capacity}</Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{daycare.name}</CardTitle>
                        <CardDescription>
                          {daycare.location}, {daycare.city}
                        </CardDescription>
                        <div className="flex mt-1">
                          {renderStars(daycare.rating)}
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{daycare.priceRange}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <span>{daycare.hours}</span>
                      </div>
                      <div>
                        <span className="font-medium">Amenities:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {daycare.amenities.slice(0, 4).map((amenity: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-gray-50">
                              {amenity}
                            </Badge>
                          ))}
                          {daycare.amenities.length > 4 && (
                            <Badge variant="outline" className="bg-gray-50">
                              +{daycare.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Services:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {daycare.services.slice(0, 3).map((service: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-gray-50">
                              {service}
                            </Badge>
                          ))}
                          {daycare.services.length > 3 && (
                            <Badge variant="outline" className="bg-gray-50">
                              +{daycare.services.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Pet Types:</span> {daycare.petTypes.join(", ")}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <a 
                      href={createWhatsAppLink(daycare.name, daycare.city)}
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
                        Book Daycare
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">No daycare centers found</h3>
              <p className="text-gray-500 max-w-lg mx-auto">
                We couldn't find any pet daycare centers matching your search criteria. 
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
              <div className="text-4xl text-blue-200 absolute top-4 left-4">"</div>
              <p className="text-gray-600 mb-4 relative z-10 pt-6">
                My dog comes home tired and happy every time. The staff sends pictures 
                throughout the day, which I absolutely love. It's like a second home for my fur baby!
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Meera Sharma</p>
                  <p className="text-sm text-gray-500">Pet parent to Rocky</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg relative">
              <div className="text-4xl text-blue-200 absolute top-4 left-4">"</div>
              <p className="text-gray-600 mb-4 relative z-10 pt-6">
                The daycare team is amazing with my anxious rescue cat. They've helped 
                her become more social, and the facilities are always clean and well-maintained.
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Rajiv Mehta</p>
                  <p className="text-sm text-gray-500">Pet parent to Luna</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg relative">
              <div className="text-4xl text-blue-200 absolute top-4 left-4">"</div>
              <p className="text-gray-600 mb-4 relative z-10 pt-6">
                I was hesitant about daycare at first, but the webcam access lets me check in anytime. 
                The staff is knowledgeable and truly care about the animals' wellbeing.
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Ananya Patel</p>
                  <p className="text-sm text-gray-500">Pet parent to Max & Coco</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in Our Pet Daycare Services?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about our services, schedules, and how we can 
            provide the best care for your furry family members.
          </p>
          <a 
            href="https://wa.me/9887805771?text=I'm%20interested%20in%20your%20pet%20daycare%20services.%20Could%20you%20please%20provide%20more%20details?"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 h-auto rounded-full">
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