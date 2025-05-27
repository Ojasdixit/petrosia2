import { useState } from "react";
import MetaTags from "@/components/common/MetaTags";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Check, MapPin, Clock, Star, CalendarRange, Eye } from "lucide-react";

type PetWalkerProps = {
  id: number;
  name: string;
  age: number;
  experience: number;
  rating: number;
  location: string;
  city: string;
  image: string;
  availability: string;
  petTypes: string[];
  services: string[];
  priceRange: string;
};

export default function ServicesWalkersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  
  // Mock data for pet walkers
  const walkers: PetWalkerProps[] = [
    {
      id: 1,
      name: "Rahul Mishra",
      age: 27,
      experience: 4,
      rating: 4.8,
      location: "Connaught Place, Central Delhi",
      city: "Delhi",
      image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      availability: "Mon-Fri: 6 AM - 10 AM, 4 PM - 8 PM",
      petTypes: ["Dogs", "Cats"],
      services: ["Walking", "Running", "Training During Walks", "Multiple Dogs"],
      priceRange: "₹300-₹500 per session"
    },
    {
      id: 2,
      name: "Ananya Singh",
      age: 24,
      experience: 3,
      rating: 4.9,
      location: "Bandra West",
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1539856945584-87bbfe3b63a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      availability: "Daily: 5 AM - 11 AM, 3 PM - 7 PM",
      petTypes: ["Dogs"],
      services: ["Walking", "Park Visits", "Basic Training", "Pet Sitting"],
      priceRange: "₹350-₹600 per session"
    },
    {
      id: 3,
      name: "Vikas Kumar",
      age: 32,
      experience: 7,
      rating: 4.7,
      location: "Koramangala",
      city: "Bangalore",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      availability: "Mon-Sun: Flexible Hours",
      petTypes: ["Dogs", "Cats", "Small Pets"],
      services: ["Walking", "Running", "Overnight Care", "Feeding Services"],
      priceRange: "₹400-₹700 per session"
    },
    {
      id: 4,
      name: "Suman Roy",
      age: 29,
      experience: 5,
      rating: 4.6,
      location: "Ballygunge",
      city: "Kolkata",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      availability: "Mon-Sat: 5 AM - 9 AM, 5 PM - 8 PM",
      petTypes: ["Dogs", "Senior Pets"],
      services: ["Walking", "Medication Administration", "Senior Pet Care", "Puppy Care"],
      priceRange: "₹250-₹450 per session"
    },
    {
      id: 5,
      name: "Karan Patel",
      age: 25,
      experience: 2,
      rating: 4.5,
      location: "Satellite",
      city: "Ahmedabad",
      image: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      availability: "Tue-Sun: 6 AM - 10 AM, 4 PM - 7 PM",
      petTypes: ["Dogs", "Active Dogs"],
      services: ["Walking", "Running", "Sports Activities", "Group Walks"],
      priceRange: "₹200-₹400 per session"
    },
    {
      id: 6,
      name: "Neha Kulkarni",
      age: 30,
      experience: 6,
      rating: 4.9,
      location: "Aundh",
      city: "Pune",
      image: "https://images.unsplash.com/photo-1548366086-7f1b76106622?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      availability: "Mon-Fri: 6 AM - 11 AM, 3 PM - 8 PM",
      petTypes: ["Dogs", "Cats", "Birds"],
      services: ["Walking", "Pet Taxi", "Daycare", "Feeding Services"],
      priceRange: "₹300-₹550 per session"
    },
    {
      id: 7,
      name: "Manoj Venkatesh",
      age: 34,
      experience: 8,
      rating: 4.8,
      location: "Adyar",
      city: "Chennai",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      availability: "Mon-Sun: 5 AM - 10 AM, 4 PM - 7 PM",
      petTypes: ["Dogs", "Exotic Pets"],
      services: ["Walking", "Beach Trips", "Training", "Photography"],
      priceRange: "₹350-₹600 per session"
    },
    {
      id: 8,
      name: "Ritu Sharma",
      age: 26,
      experience: 3,
      rating: 4.7,
      location: "Greater Kailash",
      city: "Delhi",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      availability: "Mon-Sat: 6 AM - 11 AM, 4 PM - 8 PM",
      petTypes: ["Dogs", "Puppies"],
      services: ["Walking", "Puppy Training", "Socialization", "Playtime"],
      priceRange: "₹300-₹500 per session"
    }
  ];
  
  // Filter walkers by search term and city
  const filteredWalkers = walkers.filter((walker) => {
    const matchesSearch = searchTerm === "" || 
      walker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      walker.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      walker.petTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      walker.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCity = selectedCity === "all" || walker.city.toLowerCase() === selectedCity.toLowerCase();
    
    return matchesSearch && matchesCity;
  });

  return (
    <>
      <MetaTags
        title="Pet Walkers and Dog Walking Services | Petrosia Pet Marketplace"
        description="Book professional pet walkers for your dogs, cats, and other pets in Delhi, Mumbai, Bangalore, and other major cities. Daily walks, exercise sessions, and specialized care for all pet types."
        keywords="pet walkers, dog walking services, dog exercise, pet sitting, pet exercise, professional dog walkers, cat walkers, pet care services, daily dog walking"
        url="https://petrosia.in/services/walkers"
        image="https://petrosia.in/images/pet-walkers-service.jpg"
      />
      
      <div className="bg-gradient-to-b from-amber-50 to-white py-8 mb-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pet Walkers</h1>
          <p className="text-gray-600 max-w-2xl">
            Find reliable pet walkers in your city who can keep your furry friends active and healthy. All our walkers are background-checked and pet lovers.
          </p>
          
          <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-4xl">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by name, location, services..."
                className="pr-12 py-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                className="absolute top-0 right-0 h-full rounded-l-none bg-amber-500 hover:bg-amber-600" 
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
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Kolkata">Kolkata</SelectItem>
                <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mb-10">
        {filteredWalkers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWalkers.map((walker) => (
              <div key={walker.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{walker.name}</h3>
                    <div className="flex items-center text-sm bg-amber-50 text-amber-700 px-2 py-1 rounded">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs font-medium">{walker.rating}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-amber-600 font-medium mb-2">{walker.experience} years experience</div>
                  
                  <div className="flex items-start mt-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0 mr-1.5" />
                    <div className="text-sm text-gray-600">{walker.location}, {walker.city}</div>
                  </div>
                  
                  <div className="flex items-start mt-2">
                    <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0 mr-1.5" />
                    <div className="text-sm text-gray-600">{walker.availability}</div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">For Pet Types</h5>
                    <div className="flex flex-wrap gap-1">
                      {walker.petTypes.map((petType, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded"
                        >
                          {petType}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Services</h5>
                    <ul className="space-y-1">
                      {walker.services.map((service, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <Check className="h-3.5 w-3.5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-3 text-sm font-medium text-gray-800">
                    Price Range: {walker.priceRange}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <a 
                      href={`https://wa.me/9887805771?text=${encodeURIComponent(`Hi, I'm interested in contacting ${walker.name} for pet walking services. My preferred timing would be ${walker.availability.split(':')[0]}. Please provide more information.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" 
                          alt="WhatsApp" 
                          className="w-4 h-4 mr-2" 
                        />
                        Click to WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[300px] flex justify-center items-center">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800 mb-2">No pet walkers found</p>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}