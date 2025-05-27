import { Link } from "wouter";
import { Stethoscope, Users, Scissors, Truck, ShoppingBag, FileHeart, Home, Bed } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  textColor: string;
  redirectExternal?: boolean;
};

const ServiceCard = ({ title, description, icon, link, color, textColor, redirectExternal = false }: ServiceCardProps) => {
  if (redirectExternal) {
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`${color} rounded-lg p-5 hover:shadow-md transition-shadow duration-200 flex flex-col h-full`}
      >
        <div className="mb-4">
          {icon}
        </div>
        <h3 className={`text-lg font-bold mb-2 ${textColor}`}>{title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{description}</p>
        <div className={`mt-auto text-sm font-medium ${textColor} hover:underline`}>
          Learn More
        </div>
      </a>
    );
  }

  return (
    <Link href={link}>
      <div className={`${color} rounded-lg p-5 hover:shadow-md transition-shadow duration-200 flex flex-col h-full cursor-pointer`}>
        <div className="mb-4">
          {icon}
        </div>
        <h3 className={`text-lg font-bold mb-2 ${textColor}`}>{title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{description}</p>
        <div className={`mt-auto text-sm font-medium ${textColor} hover:underline`}>
          Learn More
        </div>
      </div>
    </Link>
  );
};

const PetServices = () => {
  const services = [
    {
      title: "Pet Veterinarians",
      description: "Find experienced veterinarians for your pets in your city.",
      icon: <Stethoscope className="h-8 w-8 text-teal-600" />,
      link: "/services/vets",
      color: "bg-teal-50",
      textColor: "text-teal-700"
    },
    {
      title: "Pet Walkers",
      description: "Professional pet walkers to keep your furry friends active.",
      icon: <Users className="h-8 w-8 text-amber-600" />,
      link: "/services/walkers",
      color: "bg-amber-50",
      textColor: "text-amber-700"
    },
    {
      title: "Pet Grooming",
      description: "Keep your pets clean and healthy with professional grooming.",
      icon: <Scissors className="h-8 w-8 text-purple-600" />,
      link: "/services/grooming",
      color: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      title: "24h Delivery",
      description: "Get pet essentials delivered to your door any time, day or night.",
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      link: "https://shop.petrosia.in/shop",
      color: "bg-blue-50",
      textColor: "text-blue-700",
      redirectExternal: true
    },
    {
      title: "20% Off Premium Pet Foods",
      description: "Limited-time discount on high-quality pet foods from top brands.",
      icon: <ShoppingBag className="h-8 w-8 text-yellow-600" />,
      link: "https://shop.petrosia.in/shop",
      color: "bg-yellow-50",
      textColor: "text-yellow-700",
      redirectExternal: true
    },
    {
      title: "Annual Health Checkup",
      description: "Regular checkups for your pet's overall health and wellbeing.",
      icon: <FileHeart className="h-8 w-8 text-green-600" />,
      link: "/services/checkup",
      color: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Pet Daycare",
      description: "Let your pets socialize and play while you're away. Our daycare facilities provide a safe, supervised environment with plenty of activities to keep them engaged.",
      icon: <Home className="h-8 w-8 text-indigo-500" />,
      link: "/services/daycare",
      color: "bg-indigo-50",
      textColor: "text-indigo-700",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/54/Running_in_the_grass_yard%40Affectionate_Pet_Care.JPG" // Added image
    }
  ];

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-3">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Pet Services</h2>
          <p className="text-gray-600">
            Discover a range of professional services for all your pet care needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
              color={service.color}
              textColor={service.textColor}
              redirectExternal={service.redirectExternal}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetServices;