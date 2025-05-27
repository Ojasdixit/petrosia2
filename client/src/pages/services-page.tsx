import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import MetaTags from "@/components/common/MetaTags";
import { 
  Clipboard, 
  HeartPulse, 
  Truck, 
  Scissors, 
  ShieldCheck, 
  Star, 
  Clock, 
  Users, 
  MapPin,
  PawPrint,
  Home,
  Bed
} from "lucide-react";

const ServicesPage = () => {
  // Function to create WhatsApp booking link with pre-filled message
  const createWhatsAppLink = (service: string) => {
    const message = `Hi, I would like to book a ${service} service for my pet. Please provide more information.`;
    return `https://wa.me/9887805771?text=${encodeURIComponent(message)}`;
  };

  // Service cards data
  const services = [
    {
      title: "Professional Pet Grooming",
      description: "Give your pets the pampering they deserve with our professional grooming services. Our skilled groomers provide breed-specific cuts, baths, nail trimming, and more.",
      icon: <Scissors className="h-8 w-8 text-orange-500" />,
      features: ["Breed-specific styling", "Gentle handling", "Premium products", "De-shedding treatments"],
      cta: "Book on WhatsApp",
      link: createWhatsAppLink("Grooming"),
      badge: "Popular",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      whatsapp: true
    },
    {
      title: "Veterinary Services",
      description: "Our network of certified veterinarians provides comprehensive medical care for your pets, from routine check-ups to specialized treatments.",
      icon: <HeartPulse className="h-8 w-8 text-red-500" />,
      features: ["Vaccinations", "Surgery", "Dental care", "Diagnostic tests"],
      cta: "Book on WhatsApp",
      link: createWhatsAppLink("Veterinary"),
      badge: null,
      image: "https://www.shutterstock.com/image-photo/cropped-image-handsome-male-veterinarian-260nw-2159923499.jpg",
      whatsapp: true
    },
    {
      title: "Pet Daycare",
      description: "Let your pets socialize and play while you're away. Our daycare facilities provide a safe, supervised environment with plenty of activities to keep them engaged.",
      icon: <Home className="h-8 w-8 text-indigo-500" />,
      features: ["Supervised play areas", "Socialization activities", "Trained staff", "Daily exercise routines"],
      cta: "View Daycare Options",
      link: "/services/daycare",
      badge: "NEW",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/54/Running_in_the_grass_yard%40Affectionate_Pet_Care.JPG",
      whatsapp: false
    },
    {
      title: "Pet Boarding",
      description: "Going out of town? Our comfortable boarding facilities provide a home away from home for your pets with 24/7 care and personalized attention.",
      icon: <Bed className="h-8 w-8 text-cyan-500" />,
      features: ["24/7 supervision", "Comfortable accommodations", "Daily updates", "Individual care plans"],
      cta: "View Boarding Options",
      link: "/services/boarding",
      badge: "NEW",
      image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      whatsapp: false
    },
    {
      title: "Pet Walkers & Sitters",
      description: "Keep your pets active and happy when you're not around. Our trusted pet walkers and sitters provide personalized care for your furry friends.",
      icon: <Users className="h-8 w-8 text-green-500" />,
      features: ["Background-checked", "GPS tracked walks", "Flexible scheduling", "Daily reports"],
      cta: "Book on WhatsApp",
      link: createWhatsAppLink("Pet Walking/Sitting"),
      badge: null,
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      whatsapp: true
    },
    {
      title: "24-Hour Pet Food Delivery",
      description: "Never run out of pet food again. Get premium pet food delivered to your doorstep within hours, even late at night.",
      icon: <Truck className="h-8 w-8 text-blue-500" />,
      features: ["24/7 delivery", "Premium brands", "Subscription options", "Emergency service"],
      cta: "Order on WhatsApp",
      link: createWhatsAppLink("Food Delivery"),
      badge: "24/7",
      image: "https://images.unsplash.com/photo-1583785334247-1a845c0d266f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      whatsapp: true
    },
    {
      title: "Premium Pet Foods",
      description: "Discover a wide range of premium, nutritionally balanced pet foods. From organic to specialized diets, we have the perfect food for your pet.",
      icon: <ShieldCheck className="h-8 w-8 text-purple-500" />,
      features: ["Organic options", "Age-specific formulas", "Prescription diets", "Personalized meal plans"],
      cta: "Order on WhatsApp",
      link: createWhatsAppLink("Premium Pet Food"),
      badge: "Premium",
      image: "https://images.unsplash.com/photo-1594492544134-0ea9c2a9df6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      whatsapp: true
    },
    {
      title: "Health Check-up Packages",
      description: "Preventive care is crucial for your pet's longevity. Our comprehensive health check-up packages ensure your pet stays in optimal health.",
      icon: <Clipboard className="h-8 w-8 text-teal-500" />,
      features: ["Blood work", "Physical examination", "Parasite screening", "Dental assessment"],
      cta: "Book on WhatsApp",
      link: createWhatsAppLink("Health Check-up"),
      badge: "Essential",
      image: "https://images.unsplash.com/photo-1527443195645-1133f7f28990?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      whatsapp: true
    }
  ];

  // Testimonials data with Indian names
  const testimonials = [
    {
      name: "Arjun Sharma",
      location: "Delhi",
      service: "Grooming",
      rating: 5,
      comment: "The grooming service was exceptional! My Labrador has never looked better. The staff was gentle and professional, and they even gave me tips on maintaining his coat at home."
    },
    {
      name: "Priya Patel",
      location: "Mumbai",
      service: "Veterinary",
      rating: 5,
      comment: "Dr. Mehta is an amazing vet! She took great care of my sick cat and followed up multiple times to check on her recovery. I highly recommend the veterinary services here."
    },
    {
      name: "Kavita Gupta",
      location: "Noida",
      service: "Pet Daycare",
      rating: 5,
      comment: "My Labrador loves the daycare center! He comes home happy and tired from playing all day. The staff sends me photos throughout the day, and I love seeing him having so much fun."
    },
    {
      name: "Sanjay Mehta",
      location: "Gurugram",
      service: "Pet Boarding",
      rating: 5,
      comment: "Had to travel for a week and was anxious about leaving my Husky. The boarding facility was amazing! They followed his routine perfectly and sent daily updates. Will definitely use again."
    },
    {
      name: "Rajesh Verma",
      location: "Bangalore",
      service: "Pet Walking",
      rating: 4,
      comment: "The pet walking service has been a lifesaver for my busy schedule. Vikram is always punctual and my dog absolutely loves him. I get detailed reports after each walk."
    },
    {
      name: "Ananya Gupta",
      location: "Chennai",
      service: "Food Delivery",
      rating: 5,
      comment: "The 24-hour delivery service came to my rescue when I ran out of my dog's special diet food at midnight. The delivery was prompt and the service was courteous despite the late hour."
    },
    {
      name: "Rohan Malhotra",
      location: "Jaipur",
      service: "Pet Daycare",
      rating: 4,
      comment: "The daycare has been a blessing for my energetic Beagle. They have great play areas and structured activities. My dog is much calmer at home after his daycare sessions."
    },
    {
      name: "Nisha Reddy",
      location: "Hyderabad",
      service: "Pet Boarding",
      rating: 5,
      comment: "Best boarding experience ever! My two cats stayed for 10 days and received amazing care. They even accommodated my cats' special diets and medication schedule perfectly."
    },
    {
      name: "Vikram Singh",
      location: "Pune",
      service: "Health Check-up",
      rating: 5,
      comment: "The comprehensive health check-up for my senior Golden Retriever was worth every rupee. They detected a minor issue early, which saved us from a major treatment later."
    },
    {
      name: "Meera Jayaraman",
      location: "Hyderabad",
      service: "Premium Food",
      rating: 4,
      comment: "The premium food recommendation for my allergic Beagle worked wonders! His skin cleared up within weeks. The nutritionist really knows her stuff."
    },
    {
      name: "Rahul Khanna",
      location: "Kolkata",
      service: "Grooming & Vet",
      rating: 5,
      comment: "I've been using both grooming and veterinary services for over a year now. The staff remembers my pets by name and always provides exceptional care."
    },
    {
      name: "Sunita Agarwal",
      location: "Ahmedabad",
      service: "Pet Sitting",
      rating: 5,
      comment: "I was nervous about leaving my cats with a sitter, but Petrosia's pet sitter sent me daily photos and updates that put my mind at ease. Came home to happy, well-cared-for cats!"
    }
  ];

  // Render star ratings
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <>
      <MetaTags 
        title="Our Services | Petrosia"
        description="Discover our comprehensive range of pet services including grooming, veterinary care, walking, daycare, boarding, food delivery, and more for your beloved pets across Delhi, Mumbai, Bangalore, and other major Indian cities."
        keywords="pet services India, pet grooming, pet veterinary care, pet walking, pet daycare, pet boarding, pet food delivery, pet services Delhi, pet services Mumbai, pet services Bangalore"
        url="https://petrosia.in/services"
        image="https://petrosia.in/images/services-share.jpg"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-100 to-amber-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-heading">
                Premium Pet Services for Your Beloved Companions
              </h1>
              <p className="mt-4 text-lg text-gray-700">
                From grooming to veterinary care, walking to food delivery, we offer a comprehensive range of services to keep your pets happy, healthy, and well-cared for.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={`https://wa.me/9887805771?text=${encodeURIComponent("Hi, I'm interested in booking a pet service. Could you please provide me more information about the services you offer?")}`} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                    Book a Service
                  </Button>
                </a>
                <Link href="/services/providers">
                  <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 flex items-center gap-2">
                    View Service Providers
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Happy pets receiving care"
                className="rounded-lg shadow-lg w-full object-cover h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">Our Comprehensive Pet Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer a wide range of professional services tailored to meet the unique needs of your pets, ensuring they receive the best care possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {service.badge && (
                    <Badge className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 text-xs">
                      {service.badge}
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-orange-100">
                      {service.icon}
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <PawPrint className="h-4 w-4 text-orange-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {service.whatsapp ? (
                    <a href={service.link} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" 
                          alt="WhatsApp" 
                          className="w-5 h-5" />
                        {service.cta}
                      </Button>
                    </a>
                  ) : (
                    <Link href={service.link}>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2">
                        {service.cta}
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. See what pet parents across India have to say about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-lg border border-gray-100 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3" />
                      {testimonial.location}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                    {testimonial.service}
                  </Badge>
                </div>
                <div className="flex mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700 text-sm italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href={`https://wa.me/9887805771?text=${encodeURIComponent("Hi, I'd like to see more reviews about your pet services. Could you share some with me?")}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" 
                     alt="WhatsApp" 
                     className="w-5 h-5" />
                Request More Reviews
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">Why Choose Our Services?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We pride ourselves on offering the highest quality pet services with a focus on your pet's health, happiness, and your convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Certified Professionals</h3>
              <p className="text-gray-600">All our service providers are certified, trained, and thoroughly vetted to ensure the highest standards of care.</p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Availability</h3>
              <p className="text-gray-600">Pets don't stick to business hours, and neither do we. Our services are available round the clock for your convenience.</p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pan-India Coverage</h3>
              <p className="text-gray-600">With service providers across all major Indian cities, quality pet care is never far from your home.</p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">If you're not completely satisfied with our services, we'll make it right or refund your money.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Give Your Pet the Care They Deserve?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Book a service today and join thousands of satisfied pet parents across India who trust Petrosia for their pet care needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`https://wa.me/9887805771?text=${encodeURIComponent("Hi, I'm interested in booking one of your pet services. Could you please assist me?")}`} target="_blank" rel="noopener noreferrer">
              <Button className="bg-white text-orange-500 hover:bg-gray-100 flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" 
                     alt="WhatsApp" 
                     className="w-5 h-5" />
                Book on WhatsApp
              </Button>
            </a>
            <a href={`https://wa.me/9887805771?text=${encodeURIComponent("Hi, I have some questions about your pet services. Could your team help me?")}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white text-white hover:bg-orange-600 flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" 
                     alt="WhatsApp" 
                     className="w-5 h-5" />
                Contact Our Team
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;