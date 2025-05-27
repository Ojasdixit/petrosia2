import { useState } from "react";
import MetaTags from "@/components/common/MetaTags";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Stethoscope, MapPin, CheckSquare, Calendar, Clock, Heart, ArrowRight, Eye, Check } from "lucide-react";

type CheckupServiceProps = {
  id: number;
  name: string;
  location: string;
  city: string;
  image: string;
  hours: string;
  features: string[];
  packages: {
    name: string;
    price: number;
    description: string;
    includes: string[];
  }[];
};

export default function ServicesCheckupPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  
  // Mock data for annual health checkup services
  const healthServices: CheckupServiceProps[] = [
    {
      id: 1,
      name: "PetCare Annual Health Center",
      location: "Saket",
      city: "Delhi",
      image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
      hours: "Mon-Sat: 9 AM - 8 PM",
      features: ["Complete Blood Work", "Dental Examination", "Weight Assessment", "Vaccination Review", "Digital Records"],
      packages: [
        {
          name: "Basic Checkup",
          price: 1499,
          description: "Essential annual checkup for healthy adult pets",
          includes: ["Physical Examination", "Basic Blood Work", "Vaccination Review", "Weight Assessment"]
        },
        {
          name: "Senior Pet Care",
          price: 2999,
          description: "Comprehensive checkup for pets 7+ years",
          includes: ["Advanced Blood Work", "Dental Examination", "Joint Assessment", "Organ Function Tests", "Dietary Consultation"]
        }
      ]
    },
    {
      id: 2,
      name: "Mumbai Pet Health Center",
      location: "Worli",
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1604607050746-ded3746f6b59?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
      hours: "Mon-Sun: 10 AM - 7 PM",
      features: ["X-Ray Services", "Ultrasound", "Emergency Care", "In-house Laboratory", "Mobile Checkups"],
      packages: [
        {
          name: "Standard Wellness",
          price: 1999,
          description: "Comprehensive health assessment for all pets",
          includes: ["Full Physical Exam", "Blood Chemistry", "Urinalysis", "Parasite Screening", "Vaccination Updates"]
        },
        {
          name: "Breed-Specific Package",
          price: 3499,
          description: "Tailored health checks for specific breed needs",
          includes: ["Breed-Specific Testing", "Genetic Screening", "Specialized Physical Exam", "Nutrition Consultation", "Preventive Care Plan"]
        }
      ]
    },
    {
      id: 3,
      name: "Bangalore Pet Wellness Clinic",
      location: "Whitefield",
      city: "Bangalore",
      image: "https://images.unsplash.com/photo-1634136886460-510f0584b995?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
      hours: "Tue-Sun: 9 AM - 6 PM",
      features: ["Telemedicine", "Preventive Care Plans", "Specialized Breed Care", "Behavioral Assessment", "Digital Health Tracking"],
      packages: [
        {
          name: "Essential Wellness",
          price: 1799,
          description: "Core health services for adult pets",
          includes: ["Complete Physical", "Core Vaccines", "Dental Check", "Heartworm Test", "Nutrition Consulting"]
        },
        {
          name: "Premium Health Package",
          price: 3999,
          description: "Elite care package with comprehensive screenings",
          includes: ["Complete Blood Panel", "Thyroid Function Test", "Heart Evaluation", "Abdominal Ultrasound", "Senior Health Screening"]
        }
      ]
    },
    {
      id: 4,
      name: "Kolkata Pet Hospital",
      location: "Park Street",
      city: "Kolkata",
      image: "https://images.unsplash.com/photo-1628009368085-d7c2a303f729?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
      hours: "Mon-Sat: 8 AM - 8 PM",
      features: ["24/7 Emergency", "Surgical Services", "Oncology Screening", "Cardiology", "Orthopedic Assessment"],
      packages: [
        {
          name: "Basic Annual Care",
          price: 1299,
          description: "Fundamental health checkup for pets of all ages",
          includes: ["Physical Examination", "Basic Blood Work", "Heartworm Testing", "Fecal Examination"]
        },
        {
          name: "Comprehensive Wellness",
          price: 2599,
          description: "Complete health assessment with specialized tests",
          includes: ["Full Physical Exam", "Complete Blood Count", "Organ Function Screening", "Urinalysis", "Thyroid Testing"]
        }
      ]
    },
    {
      id: 5,
      name: "Ahmedabad Veterinary Center",
      location: "Bodakdev",
      city: "Ahmedabad",
      image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
      hours: "Mon-Sat: 9 AM - 7 PM",
      features: ["Pathology Lab", "Radiology", "Preventive Medicine", "Geriatric Care", "Microchipping"],
      packages: [
        {
          name: "Standard Checkup",
          price: 1199,
          description: "Regular yearly checkup for healthy pets",
          includes: ["Basic Physical", "Blood Screening", "Vaccination Assessment", "Parasite Check"]
        },
        {
          name: "Premium Care Package",
          price: 2799,
          description: "Advanced annual health assessment",
          includes: ["Full Health Screening", "Dental Prophylaxis", "Eye Pressure Test", "Heartworm Prevention", "Dietary Planning"]
        }
      ]
    },
    {
      id: 6,
      name: "Pune Pet Health Hub",
      location: "Koregaon Park",
      city: "Pune",
      image: "https://images.unsplash.com/photo-1618516976-92298c1a1c31?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
      hours: "Tue-Sun: 10 AM - 7:30 PM",
      features: ["Allergy Testing", "Preventive Care", "Dermatology Services", "Pet Health Insurance", "Travel Certificates"],
      packages: [
        {
          name: "Basic Wellness",
          price: 1599,
          description: "Standard annual check for pets",
          includes: ["Health Evaluation", "Parasite Screening", "Vaccines Update", "Weight Management"]
        },
        {
          name: "Advanced Health Screening",
          price: 3299,
          description: "Thorough health evaluation with specialized diagnostics",
          includes: ["Extensive Blood Work", "Radiographs", "Electrocardiogram", "Ophthalmology Screening", "Joint Assessment"]
        }
      ]
    },
    {
      id: 7,
      name: "Chennai Pet Clinic",
      location: "Nungambakkam",
      city: "Chennai",
      image: "https://images.unsplash.com/photo-1628111356831-9e76a4e11f18?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
      hours: "Mon-Sun: 9 AM - 8 PM",
      features: ["Digital Records", "Specialized Care", "Rehabilitation Services", "Nutritional Counseling", "Home Visits"],
      packages: [
        {
          name: "Essential Health Check",
          price: 1399,
          description: "Core health evaluation for all pets",
          includes: ["Complete Physical", "Blood Work", "Fecal Analysis", "Dental Check"]
        },
        {
          name: "Elite Care Program",
          price: 2999,
          description: "Premium annual checkup with specialized services",
          includes: ["Complete Health Assessment", "Specialized Blood Tests", "Ultrasound Screening", "Dental Cleaning", "Customized Diet Plan"]
        }
      ]
    }
  ];
  
  // Filter health services by search term and city
  const filteredServices = healthServices.filter((service) => {
    const matchesSearch = searchTerm === "" || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCity = selectedCity === "all" || service.city.toLowerCase() === selectedCity.toLowerCase();
    
    return matchesSearch && matchesCity;
  });

  return (
    <>
      <MetaTags
        title="Annual Pet Health Checkup Services | Petrosia Pet Marketplace"
        description="Find veterinary clinics offering annual health checkups and wellness packages for your pets in Delhi, Mumbai, Bangalore, and other major cities. Regular checkups ensure early detection of health issues."
        keywords="pet health checkup, annual pet checkup, veterinary services, pet wellness packages, pet preventive care, pet health screening, veterinary clinics, pet blood work, pet dental examination"
        url="https://petrosia.in/services/checkup"
        image="https://petrosia.in/images/pet-checkup-service.jpg"
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-50 to-white py-8 mb-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Annual Pet Health Checkup</h1>
          <p className="text-gray-600 max-w-2xl">
            Regular health checkups are essential for your pet's wellbeing. Find veterinary clinics and hospitals offering annual health assessment packages for your furry friends.
          </p>
          
          <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-4xl">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by clinic name, location, services..."
                className="pr-12 py-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                className="absolute top-0 right-0 h-full rounded-l-none bg-green-600 hover:bg-green-700" 
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
      
      {/* Why Annual Checkups Section */}
      <div className="bg-white py-10 mb-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Why Annual Checkups Matter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Early Detection</h3>
              <p className="text-gray-600">
                Regular checkups help identify potential health issues before they become serious, allowing for earlier treatment.
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Preventive Care</h3>
              <p className="text-gray-600">
                Maintain current vaccinations, update parasite prevention, and assess your pet's overall wellness.
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aging Assessment</h3>
              <p className="text-gray-600">
                As pets age, their health needs change. Regular checkups help adapt care to their life stage requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Health Services List */}
      <div className="container mx-auto px-4 mb-10">
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-6 flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                    
                    <div className="flex items-start mt-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0 mr-2" />
                      <div className="text-sm text-gray-600">{service.location}, {service.city}</div>
                    </div>
                    
                    <div className="flex items-start mt-2">
                      <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0 mr-2" />
                      <div className="text-sm text-gray-600">{service.hours}</div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Features & Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, index) => (
                          <div key={index} className="text-xs flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            <CheckSquare className="h-3 w-3 text-green-500 mr-1" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Checkup Packages</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {service.packages.map((pkg, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-gray-900">{pkg.name}</h5>
                              <div className="text-green-600 font-bold">₹{pkg.price}</div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                            <div className="space-y-1">
                              {pkg.includes.map((item, i) => (
                                <div key={i} className="text-xs flex items-start">
                                  <CheckSquare className="h-3 w-3 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                  <span className="text-gray-700">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                        onClick={() => {
                          const detailsElement = document.getElementById(`checkup-details-${service.id}`);
                          if (detailsElement) {
                            if (detailsElement.classList.contains('hidden')) {
                              detailsElement.classList.remove('hidden');
                            } else {
                              detailsElement.classList.add('hidden');
                            }
                          }
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </Button>
                      
                      <div id={`checkup-details-${service.id}`} className="mt-4 hidden">
                        <div className="bg-green-50 p-4 rounded-md border border-green-100 text-sm">
                          <h5 className="font-medium text-green-800 mb-2">Appointment Information</h5>
                          <ul className="space-y-2 mb-4">
                            {service.packages.map((pkg, i) => (
                              <li key={i} className="flex items-start">
                                <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                <div>
                                  <span className="font-medium">{pkg.name}</span>: ₹{pkg.price}
                                  <p className="text-xs text-gray-600 mt-1">{pkg.description}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                          
                          <h5 className="font-medium text-green-800 mb-2">Make an Appointment</h5>
                          <a 
                            href={`https://wa.me/9887805771?text=${encodeURIComponent(`Hi, I would like to book a checkup for my pet with ${service.name}. Package: ${service.packages[0].name}. Please provide more information.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-green-700"
                          >
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" 
                              alt="WhatsApp" 
                              className="w-4 h-4 mr-1" 
                            />
                            Contact on WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[300px] flex justify-center items-center">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800 mb-2">No health services found</p>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}