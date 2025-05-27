import { useState } from "react";
import MetaTags from "@/components/common/MetaTags";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Phone, MapPin, Clock, Award, Star } from "lucide-react";

type VeterinarianProps = {
  id: number;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  rating: number;
  clinic: string;
  location: string;
  city: string;
  image: string;
  hours: string;
  services: string[];
};

export default function ServicesVetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  
  // Mock data for veterinarians
  const vets: VeterinarianProps[] = [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      specialty: "Small Animals",
      qualification: "MVSc (Surgery)",
      experience: 15,
      rating: 4.8,
      clinic: "Pawsome Veterinary Clinic",
      location: "Vasant Kunj",
      city: "Delhi",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      hours: "Mon-Sat: 9 AM - 8 PM",
      services: ["Vaccinations", "Surgery", "Dental Care", "Emergency Services"]
    },
    {
      id: 2,
      name: "Dr. Priya Patel",
      specialty: "Exotic Pets",
      qualification: "BVSc & AH, MVSc",
      experience: 10,
      rating: 4.9,
      clinic: "Exotic Pet Care Center",
      location: "Andheri West",
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      hours: "Mon-Sun: 10 AM - 7 PM",
      services: ["Exotic Pet Medicine", "Preventive Care", "Diagnostics", "Nutritional Counseling"]
    },
    {
      id: 3,
      name: "Dr. Arun Verma",
      specialty: "Dermatology",
      qualification: "MVSc, PhD",
      experience: 12,
      rating: 4.7,
      clinic: "PetDerm Specialists",
      location: "Indiranagar",
      city: "Bangalore",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      hours: "Tue-Sun: 11 AM - 9 PM",
      services: ["Skin Treatments", "Allergy Testing", "Advanced Diagnostics", "Chronic Disease Management"]
    },
    {
      id: 4,
      name: "Dr. Mitali Sen",
      specialty: "Orthopedics",
      qualification: "BVSc, Diplomate ACVS",
      experience: 18,
      rating: 4.8,
      clinic: "Animal Orthopedic Center",
      location: "Salt Lake City",
      city: "Kolkata",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      hours: "Mon-Fri: 8 AM - 6 PM",
      services: ["Joint Surgery", "Fracture Repair", "Arthroscopy", "Physical Therapy"]
    },
    {
      id: 5,
      name: "Dr. Sanjay Mehta",
      specialty: "Cardiology",
      qualification: "DVM, MS (Cardiology)",
      experience: 14,
      rating: 4.6,
      clinic: "Pet Heart Care",
      location: "Navrangpura",
      city: "Ahmedabad",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      hours: "Mon-Sat: 9:30 AM - 7:30 PM",
      services: ["Cardiac Evaluations", "Echocardiography", "Cardiac Surgery", "Preventive Care"]
    },
    {
      id: 6,
      name: "Dr. Kavita Nair",
      specialty: "General Practice",
      qualification: "MVSc",
      experience: 9,
      rating: 4.7,
      clinic: "Happy Paws Veterinary Hospital",
      location: "Koregaon Park",
      city: "Pune",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      hours: "Mon-Sun: 24 Hours",
      services: ["Wellness Exams", "Vaccinations", "Emergency Care", "Microchipping"]
    },
    {
      id: 7,
      name: "Dr. Ravi Kumar",
      specialty: "Internal Medicine",
      qualification: "BVSc & AH, MVSc (Medicine)",
      experience: 16,
      rating: 4.9,
      clinic: "Advanced Veterinary Care",
      location: "T. Nagar",
      city: "Chennai",
      image: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      hours: "Mon-Sat: 10 AM - 8 PM",
      services: ["Geriatric Care", "Chronic Disease Management", "Diagnostics", "Nutritional Counseling"]
    },
    {
      id: 8,
      name: "Dr. Sunil Gupta",
      specialty: "Surgery",
      qualification: "MVSc (Surgery), DACVS",
      experience: 20,
      rating: 4.9,
      clinic: "Delhi Pet Surgical Center",
      location: "Saket",
      city: "Delhi",
      image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      hours: "Mon-Sat: 9 AM - 6 PM",
      services: ["Soft Tissue Surgery", "Orthopedic Surgery", "Advanced Diagnostics", "Post-op Care"]
    }
  ];
  
  // Filter vets by search term and city
  const filteredVets = vets.filter((vet) => {
    const matchesSearch = searchTerm === "" || 
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = selectedCity === "all" || vet.city.toLowerCase() === selectedCity.toLowerCase();
    
    return matchesSearch && matchesCity;
  });

  return (
    <>
      <MetaTags
        title="Pet Veterinarians and Animal Doctors | Petrosia Pet Marketplace"
        description="Find qualified veterinarians and animal doctors for your pets in Delhi, Mumbai, Bangalore, and other major cities. Connect with specialists in small animals, exotic pets, surgery, orthopedics, and more."
        keywords="pet veterinarians, animal doctors, pet healthcare, veterinary services, pet specialists, exotic pet vets, small animal vets, emergency vet care, pet clinic, veterinary hospital"
        url="https://petrosia.in/services/vets"
        image="https://petrosia.in/images/pet-veterinarians-service.jpg"
      />
      
      <div className="bg-gradient-to-b from-teal-50 to-white py-8 mb-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pet Veterinarians</h1>
          <p className="text-gray-600 max-w-2xl">
            Find experienced veterinarians for your pets in your city. All our listed vets are qualified professionals with years of experience in pet healthcare.
          </p>
          
          <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-4xl">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by name, specialty, location..."
                className="pr-12 py-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                className="absolute top-0 right-0 h-full rounded-l-none bg-teal-500 hover:bg-teal-600" 
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
        {filteredVets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVets.map((vet) => (
              <div key={vet.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex flex-col p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{vet.name}</h3>
                    <div className="flex items-center text-sm bg-teal-50 text-teal-700 px-2 py-1 rounded">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                      {vet.rating}
                    </div>
                  </div>
                  
                  <div className="text-sm text-teal-600 font-medium mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    {vet.specialty} · {vet.experience} years exp
                  </div>
                  
                  <div className="text-gray-500 text-sm mb-2">{vet.qualification}</div>
                  
                  <h4 className="font-medium text-gray-900 mt-3">{vet.clinic}</h4>
                  
                  <div className="flex items-start mt-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0 mr-1.5" />
                    <div className="text-sm text-gray-600">{vet.location}, {vet.city}</div>
                  </div>
                  
                  <div className="flex items-start mt-2">
                    <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0 mr-1.5" />
                    <div className="text-sm text-gray-600">{vet.hours}</div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Services</h5>
                    <div className="flex flex-wrap gap-1">
                      {vet.services.map((service, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <a 
                      href={`https://wa.me/9887805771?text=${encodeURIComponent(`Hi, I'm interested in reaching out to ${vet.name} at ${vet.clinic} in ${vet.city}. Could you please provide me with more information about their services?`)}`}
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
              <p className="text-lg font-medium text-gray-800 mb-2">No veterinarians found</p>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}