
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, PawPrint } from "lucide-react";

const PetDaycarePage = () => {
  const daycares = [
    {
      id: 1,
      name: "Paws Play Paradise",
      rating: 4.9,
      location: "Andheri West",
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      hours: "Mon-Sat: 7 AM - 8 PM",
      petTypes: ["Dogs", "Cats"],
      amenities: ["Indoor Play Area", "Outdoor Yard", "Webcam Access", "Climate Controlled"],
      services: ["Full Day Care", "Half Day Care", "Socialization", "Basic Training"],
      priceRange: "₹800-₹1,500 per day"
    },
    {
      id: 2,
      name: "Happy Tails Daycare",
      rating: 4.8,
      location: "Indiranagar",
      city: "Bangalore",
      image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      hours: "All Days: 7 AM - 9 PM",
      petTypes: ["Dogs"],
      amenities: ["Swimming Pool", "Agility Course", "Spacious Play Areas", "Webcam Monitoring"],
      services: ["Full Day Play", "Half Day Care", "Puppy Socialization", "Training Sessions"],
      priceRange: "₹900-₹1,800 per day"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pet Daycare Services | Petrosia</title>
        <meta name="description" content="Professional pet daycare services to keep your pets active and entertained" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-amber-500 py-20">
        <div className="absolute inset-0 opacity-20 bg-pattern-pet-paws"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Pet Daycare Services</h1>
            <p className="text-xl text-amber-100 mb-8">
              A Safe, Fun Place For Your Pets To Play And Socialize While You're Away
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="#daycares" className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg font-medium transition duration-300">
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
            <div className="bg-orange-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PawPrint className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fun Activities</h3>
              <p className="text-gray-600">
                Structured play sessions, toys, and enrichment activities to keep your pet mentally stimulated.
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Socialization</h3>
              <p className="text-gray-600">
                Safe interaction with other pets to improve social skills and reduce behavioral issues.
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PawPrint className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Professional Care</h3>
              <p className="text-gray-600">
                Trained staff monitor your pet's health, behavior, and needs throughout the day.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Daycare Facilities Section */}
      <section id="daycares" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Pet Daycare Facilities</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover our network of premium pet daycare facilities that provide safe,
            fun environments for your pet to play and socialize.
          </p>
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {daycares.map((daycare) => (
              <Card key={daycare.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={daycare.image} 
                    alt={daycare.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-orange-100 text-orange-800">
                    {daycare.hours}
                  </Badge>
                </div>
                <CardHeader>
                  <h3 className="text-xl font-bold">{daycare.name}</h3>
                  <p className="text-sm text-gray-500">{daycare.location}, {daycare.city}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {daycare.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="bg-amber-50">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Price Range:</p>
                      <p className="text-sm text-gray-600">{daycare.priceRange}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <a
                    href={`https://wa.me/9887805771?text=${encodeURIComponent(`Hi, I'm interested in daycare services at ${daycare.name}. Could you provide more information?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2">
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

export default PetDaycarePage;
