import { useState } from "react";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Scissors, MapPin, Clock, Star, Home, Sparkles, DollarSign } from "lucide-react";

type GroomingServiceProps = {
  id: number;
  name: string;
  rating: number;
  location: string;
  city: string;
  image: string;
  hours: string;
  homeService: boolean;
  petTypes: string[];
  services: string[];
  priceRange: string;
  special: string[];
};

export default function ServicesGroomingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  
  // Mock data for pet grooming services
  const groomers: GroomingServiceProps[] = [
    {
      id: 1,
      name: "Fluffy Tails Pet Spa",
      rating: 4.8,
      location: "Malviya Nagar",
      city: "Delhi",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      hours: "Mon-Sat: 10 AM - 8 PM",
      homeService: true,
      petTypes: ["Dogs", "Cats", "Small Pets"],
      services: ["Bath & Brush", "Haircut & Styling", "Nail Trimming", "Ear Cleaning", "Teeth Brushing", "De-shedding"],
      priceRange: "₹800-₹2,500",
      special: ["Premium Products", "Aromatherapy", "Pet Pickup & Drop"]
    },
    {
      id: 2,
      name: "Pawsome Grooming Studio",
      rating: 4.9,
      location: "Juhu",
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      hours: "Tue-Sun: 9 AM - 7 PM",
      homeService: true,
      petTypes: ["Dogs", "Cats"],
      services: ["Full Grooming", "Express Grooming", "Breed-Specific Cuts", "Flea Treatments", "Paw Care", "Anal Gland Expression"],
      priceRange: "₹1,000-₹3,000",
      special: ["Organic Products", "Medical Grooming", "Luxury Pet Spa"]
    },
    {
      id: 3,
      name: "Trendy Paws Salon",
      rating: 4.7,
      location: "HSR Layout",
      city: "Bangalore",
      image: "https://images.unsplash.com/photo-1596492784531-6c3dca8d9c45?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      hours: "Mon-Sun: 9:30 AM - 8:30 PM",
      homeService: false,
      petTypes: ["Dogs", "Cats", "Birds"],
      services: ["Premium Grooming", "Color Treatments", "Fur Styling", "Paw & Pad Treatment", "Skin Therapy", "Pet Massage"],
      priceRange: "₹900-₹2,800",
      special: ["Certified Groomers", "Show Grooming", "Pet Photography"]
    },
    {
      id: 4,
      name: "PetStyle Grooming Lounge",
      rating: 4.6,
      location: "New Alipore",
      city: "Kolkata",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      hours: "Mon-Sat: 10 AM - 7 PM",
      homeService: true,
      petTypes: ["Dogs", "Cats", "Exotic Pets"],
      services: ["Basic Grooming", "Spa Treatments", "Specialized Shampoo", "Coat Conditioning", "Dental Care", "Ear Plucking"],
      priceRange: "₹700-₹2,200",
      special: ["Senior Pet Care", "Anxious Pet Specialists", "Natural Products"]
    },
    {
      id: 5,
      name: "Urban Pet Groomers",
      rating: 4.5,
      location: "Vastrapur",
      city: "Ahmedabad",
      image: "https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      hours: "Tue-Sun: 10 AM - 8 PM",
      homeService: false,
      petTypes: ["Dogs", "Cats", "Rabbits"],
      services: ["Complete Grooming", "Hair Styling", "Nail Trimming", "Ear Cleaning", "Sanitary Trim", "Face Trim"],
      priceRange: "₹600-₹1,800",
      special: ["Professional Equipment", "Monthly Plans", "Loyalty Programs"]
    },
    {
      id: 6,
      name: "Elite Pet Styling",
      rating: 4.9,
      location: "Kothrud",
      city: "Pune",
      image: "https://images.unsplash.com/photo-1603232644140-bb47da511b92?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      hours: "Mon-Sat: 9 AM - 7 PM",
      homeService: true,
      petTypes: ["Dogs", "Cats", "Small Animals"],
      services: ["Full-Service Grooming", "Bath & Tidy", "Breed Cuts", "Hand Stripping", "Dematting", "Flea & Tick Treatment"],
      priceRange: "₹800-₹2,500",
      special: ["Mobile Grooming Van", "Low-Stress Handling", "Express Service"]
    },
    {
      id: 7,
      name: "Royal Pets Grooming",
      rating: 4.8,
      location: "Anna Nagar",
      city: "Chennai",
      image: "https://images.unsplash.com/photo-1576511499013-e3577694351d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      hours: "Mon-Sun: 8 AM - 8 PM",
      homeService: true,
      petTypes: ["Dogs", "Cats", "Guinea Pigs"],
      services: ["Luxury Grooming", "Medicated Baths", "Scissor Finish", "Pawdicure", "Detangling", "Specialized Cuts"],
      priceRange: "₹900-₹3,000",
      special: ["International Certified Groomers", "Premium Products", "Appointment Only"]
    },
    {
      id: 8,
      name: "Furry Friends Spa",
      rating: 4.7,
      location: "Rajouri Garden",
      city: "Delhi",
      image: "https://images.unsplash.com/photo-1537361438269-0f515cf10a6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      hours: "Tue-Sun: 10:30 AM - 8:30 PM",
      homeService: false,
      petTypes: ["Dogs", "Cats"],
      services: ["Premium Bath", "Styling", "Nail Care", "Ear Care", "Deep Conditioning", "Teeth Brushing"],
      priceRange: "₹750-₹2,300",
      special: ["Cage-Free Facility", "All-Natural Products", "Stress-Free Environment"]
    }
  ];
  
  // Filter groomers by search term and city
  const filteredGroomers = groomers.filter((groomer) => {
    const matchesSearch = searchTerm === "" || 
      groomer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      groomer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      groomer.petTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      groomer.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCity = selectedCity === "all" || groomer.city.toLowerCase() === selectedCity.toLowerCase();
    
    return matchesSearch && matchesCity;
  });

  return (
    <>
      <Helmet>
        <title>Pet Grooming Services | Petrosia Pet Marketplace</title>
      </Helmet>
      
      <div className="bg-gradient-to-b from-purple-50 to-white py-8 mb-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pet Grooming Services</h1>
          <p className="text-gray-600 max-w-2xl">
            Find professional pet grooming services in your city. From basic grooming to luxury spa treatments, keep your pets clean, healthy, and looking their best.
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
        {filteredGroomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGroomers.map((groomer) => (
              <div key={groomer.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                    <img 
                      src={groomer.image} 
                      alt={groomer.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{groomer.name}</h3>
                      <div className="flex items-center text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                        {groomer.rating}
                      </div>
                    </div>
                    
                    <div className="flex items-start mt-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0 mr-1.5" />
                      <div className="text-sm text-gray-600">{groomer.location}, {groomer.city}</div>
                    </div>
                    
                    <div className="flex items-start mt-2">
                      <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0 mr-1.5" />
                      <div className="text-sm text-gray-600">{groomer.hours}</div>
                    </div>
                    
                    {groomer.homeService && (
                      <div className="mt-2 inline-flex items-center text-sm bg-green-50 text-green-700 px-2 py-1 rounded">
                        <Home className="h-3 w-3 mr-1" /> Home Service Available
                      </div>
                    )}
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">For Pet Types</h5>
                      <div className="flex flex-wrap gap-1">
                        {groomer.petTypes.map((petType, index) => (
                          <span 
                            key={index} 
                            className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                          >
                            {petType}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                      {groomer.services.slice(0, 6).map((service, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-center">
                          <Scissors className="h-3 w-3 text-purple-400 mr-1.5 flex-shrink-0" />
                          {service}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="text-xs font-medium text-purple-700 flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" /> Special Features
                      </h5>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {groomer.special.map((specialFeature, index) => (
                          <span 
                            key={index} 
                            className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded"
                          >
                            {specialFeature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-800">{groomer.priceRange}</span>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <a 
                        href={`https://wa.me/9887805771?text=${encodeURIComponent(`Hi, I'm interested in booking an appointment at ${groomer.name} in ${groomer.city}. Could you please provide me with more information about your grooming services?`)}`}
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
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[300px] flex justify-center items-center">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800 mb-2">No grooming services found</p>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}