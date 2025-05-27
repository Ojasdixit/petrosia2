
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, PawPrint } from "lucide-react";

const PetBoardingPage = () => {
  const boardings = [
    {
      id: 1,
      name: "Furry Friends Resort",
      rating: 4.9,
      location: "DLF Phase 3",
      city: "Gurugram",
      image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      hours: "24/7 (Check-in: 10 AM - 7 PM)",
      petTypes: ["Dogs", "Cats"],
      amenities: ["Private Suites", "Webcam Access", "Daily Updates", "Outdoor Play", "Vet on Call"],
      priceRange: "₹800-₹2,000 per night",
      minStay: "1 Night"
    },
    {
      id: 2,
      name: "Paws & Relax Inn",
      rating: 4.8,
      location: "Whitefield",
      city: "Bangalore",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      hours: "24/7 (Check-in: 9 AM - 8 PM)",
      petTypes: ["Dogs"],
      amenities: ["Luxury Suites", "Swimming Pool", "Training Sessions", "Grooming", "24/7 Staff"],
      priceRange: "₹1,000-₹2,500 per night",
      minStay: "2 Nights"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pet Boarding Services | Petrosia</title>
        <meta name="description" content="Discover comfortable and reliable pet boarding facilities for your furry friends" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-700 to-purple-600 py-20">
        <div className="absolute inset-0 opacity-20 bg-pattern-pet-paws"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Pet Boarding Services</h1>
            <p className="text-xl text-indigo-100 mb-8">
              A Home Away From Home For Your Beloved Pets While You Travel
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="#boardings" className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium transition duration-300">
                Find Boarding Facilities
              </a>
              <a 
                href="https://wa.me/9887805771?text=I%20need%20help%20finding%20the%20right%20pet%20boarding%20service.%20Can%20you%20assist?"
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
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Pet Boarding Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comfortable Accommodations</h3>
              <p className="text-gray-600">
                Clean, spacious, and climate-controlled environments designed for your pet's comfort.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PawPrint className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Supervision</h3>
              <p className="text-gray-600">
                Professional staff monitor pets around the clock, ensuring safety and immediate attention to any needs.
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Daily Activities</h3>
              <p className="text-gray-600">
                Structured exercise, playtime, and socialization to keep your pet happy and active.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Boarding Facilities Section */}
      <section id="boardings" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Pet Boarding Facilities</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover our network of premium pet boarding facilities that provide comfortable 
            accommodations and exceptional care while you're away.
          </p>
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boardings.map((boarding) => (
              <Card key={boarding.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={boarding.image} 
                    alt={boarding.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-indigo-100 text-indigo-800">
                    Min Stay: {boarding.minStay}
                  </Badge>
                </div>
                <CardHeader>
                  <h3 className="text-xl font-bold">{boarding.name}</h3>
                  <p className="text-sm text-gray-500">{boarding.location}, {boarding.city}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {boarding.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="bg-purple-50">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Price Range:</p>
                      <p className="text-sm text-gray-600">{boarding.priceRange}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <a
                    href={`https://wa.me/9887805771?text=${encodeURIComponent(`Hi, I'm interested in boarding services at ${boarding.name}. Could you provide more information?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center gap-2">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" 
                        alt="WhatsApp" 
                        className="w-5 h-5" 
                      />
                      Book Now
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PetBoardingPage;
