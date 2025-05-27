import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AdoptionListing } from "@shared/schema";
import { Heart, PawPrint, MapPin, Calendar, MessageCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

type AdoptionCardProps = {
  pet: AdoptionListing;
  featured?: boolean;
  isNew?: boolean;
};

// Helper function to format age
const formatAge = (ageInMonths: number) => {
  if (ageInMonths < 1) {
    return "< 1 month";
  } else if (ageInMonths < 12) {
    return `${ageInMonths} month${ageInMonths === 1 ? "" : "s"}`;
  } else {
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    if (months === 0) {
      return `${years} year${years === 1 ? "" : "s"}`;
    } else {
      return `${years} year${years === 1 ? "" : "s"}, ${months} month${months === 1 ? "" : "s"}`;
    }
  }
};

const AdoptionCard = ({ pet, featured = false, isNew = false }: AdoptionCardProps) => {
  const [, navigate] = useLocation();
  
  const handleContactClick = () => {
    // Create WhatsApp link with pre-filled message
    const message = `Hello! I'm interested in adopting ${pet.name}. Can you provide more information about this pet? Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${pet.contactPhone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const goToDetailPage = () => {
    navigate(`/adoption/${pet.id}`);
  };

  return (
    <Card className={`h-full overflow-hidden transition-all duration-300 ${featured ? 'shadow-lg scale-105 border-primary/20' : 'shadow hover:shadow-md'}`}>
      <CardHeader className="p-0 relative overflow-hidden">
        <div className="aspect-square overflow-hidden relative group">
          <img
            src={pet.images[0]}
            alt={pet.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
          {isNew && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
            </div>
          )}
          {pet.status === "pending" && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white">Pending</Badge>
            </div>
          )}
          <div 
            className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" 
            onClick={goToDetailPage}
          >
            <Button variant="secondary" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex justify-between items-start">
          <h3 
            className="text-lg font-bold truncate hover:text-primary cursor-pointer transition-colors" 
            onClick={goToDetailPage}
          >
            {pet.name}
          </h3>
          <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />
        </div>
        
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <PawPrint className="h-4 w-4" />
          <span>{pet.breed}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{pet.location}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{formatAge(pet.age)}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 my-3">
          {pet.isVaccinated && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              Vaccinated
            </Badge>
          )}
          {pet.isNeutered && (
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              Neutered/Spayed
            </Badge>
          )}
          {pet.specialNeeds && (
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              Special Needs
            </Badge>
          )}
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            {pet.gender}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Button 
          className="w-full gap-2" 
          onClick={handleContactClick}
        >
          <MessageCircle className="h-4 w-4" />
          Enquire About Adoption
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdoptionCard;