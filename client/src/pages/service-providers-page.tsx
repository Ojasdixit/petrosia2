import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { ServiceProviderList } from "@/components/booking/ServiceProviderList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import MetaTags from "@/components/common/MetaTags";

export default function ServiceProvidersPage() {
  const params = useParams<{ type?: string }>();
  const serviceType = params.type || "";
  
  // Get title and description based on service type
  const pageInfo = getPageInfo(serviceType);

  // Get SEO keywords based on service type
  const getKeywords = () => {
    const baseKeywords = "pet services, pet care providers, service booking";
    const locationKeywords = "Delhi, Mumbai, Bangalore, Pune, Kolkata, Chennai, Ahmedabad";
    
    switch (serviceType) {
      case "daycare":
        return `pet daycare, dog daycare, cat daycare, ${baseKeywords}, AC pet daycare, ${locationKeywords}`;
      case "boarding":
        return `pet boarding, dog boarding, cat boarding, overnight pet care, ${baseKeywords}, ${locationKeywords}`;
      case "vet":
        return `pet vets, veterinarians, pet healthcare, pet doctors, ${baseKeywords}, ${locationKeywords}`;
      case "walker":
        return `dog walkers, pet walking service, daily dog walks, ${baseKeywords}, ${locationKeywords}`;
      case "trainer":
        return `dog trainers, pet training, dog behavior training, ${baseKeywords}, ${locationKeywords}`;
      default:
        return `pet services, pet daycare, pet boarding, veterinarians, dog walkers, pet trainers, ${baseKeywords}, ${locationKeywords}`;
    }
  };

  return (
    <>
      <MetaTags
        title={`${pageInfo.title} | Petrosia`}
        description={pageInfo.description}
        keywords={getKeywords()}
        url={`https://petrosia.in/services/providers${serviceType ? `/${serviceType}` : ''}`}
        image="https://petrosia.in/images/service-providers-share.jpg"
      />

      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex flex-col gap-4">
          <Button 
            variant="ghost" 
            className="w-fit flex items-center gap-2" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{pageInfo.title}</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              {pageInfo.description}
            </p>
          </div>
        </div>

        <ServiceProviderList serviceType={serviceType} />
      </div>
    </>
  );
}

// Helper function to get page title and description based on service type
function getPageInfo(serviceType: string) {
  switch (serviceType) {
    case "daycare":
      return {
        title: "Pet Daycare Services",
        description: "Find the best pet daycare services in your city. We offer both AC and non-AC options with professional staff to take care of your pets while you're away."
      };
    case "boarding":
      return {
        title: "Pet Boarding Services",
        description: "Book pet boarding services for overnight stays. Our providers offer comfortable accommodations, regular exercise, and personalized attention for your pets."
      };
    case "vet":
      return {
        title: "Veterinary Services",
        description: "Connect with qualified veterinarians for your pet's healthcare needs. From routine check-ups to emergency care, our vet providers ensure your pet's wellbeing."
      };
    case "walker":
      return {
        title: "Dog Walking Services",
        description: "Hire professional dog walkers to keep your pet active and healthy. Choose from once-daily or twice-daily walking schedules, with detailed reports after each walk."
      };
    case "trainer":
      return {
        title: "Dog Training Services",
        description: "Book expert dog trainers to help with obedience training, behavior correction, and specialized skills. Our certified trainers use positive reinforcement methods."
      };
    default:
      return {
        title: "Pet Services",
        description: "Discover a wide range of pet services including daycare, boarding, veterinary care, dog walking, and training. Book and pay online or inquire via WhatsApp."
      };
  }
}