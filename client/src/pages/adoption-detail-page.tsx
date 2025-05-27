import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { AdoptionListing } from "@shared/schema";

import {
  Calendar,
  MapPin,
  MessageCircle,
  PawPrint,
  Heart,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Helper function to format age
function formatAge(ageInMonths: number) {
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
}

export default function AdoptionDetailPage() {
  const { toast } = useToast();
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Extract the ID from the URL
  const id = location.split("/")[2];
  
  // Fetch the adoption listing
  const { data: adoptionListing, isLoading, error } = useQuery<AdoptionListing>({
    queryKey: ["/api/adoption-listings", id],
    retry: 1,
  });

  const handleContactClick = () => {
    if (!adoptionListing) return;
    
    // Create WhatsApp link with pre-filled message
    const message = `Hello! I'm interested in adopting ${adoptionListing.name}. Can you provide more information about this pet? Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adoptionListing.contactPhone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: `Adopt ${adoptionListing?.name}`,
        text: `Check out ${adoptionListing?.name}, a beautiful ${adoptionListing?.breed} looking for a forever home!`,
        url: window.location.href,
      }).catch(err => {
        toast({
          title: "Couldn't share listing",
          description: "An error occurred while trying to share this listing.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link copied!",
          description: "Share this link with your friends and family.",
        });
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-8 rounded-full mr-2" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="flex gap-2 mt-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-24 rounded-md" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-12 w-full rounded-md mb-4" />
            <Skeleton className="h-8 w-3/4 rounded-md mb-2" />
            <Skeleton className="h-8 w-1/2 rounded-md mb-6" />
            <Skeleton className="h-40 w-full rounded-md mb-4" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !adoptionListing) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
        <p className="text-gray-600 mb-6">
          The adoption listing you're looking for might have been removed or is no longer available.
        </p>
        <Link href="/adoption">
          <Button>Browse Available Pets</Button>
        </Link>
      </div>
    );
  }

  // Get the pet type icon
  const getPetTypeIcon = () => {
    switch (adoptionListing.petType) {
      case "dog":
        return "🐕";
      case "cat":
        return "🐈";
      case "bird":
        return "🦜";
      case "fish":
        return "🐠";
      case "small_pet":
        return "🐹";
      default:
        return "🐾";
    }
  };

  // Get the adoption status badge
  const getStatusBadge = () => {
    switch (adoptionListing.status) {
      case "available":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Available for Adoption
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            Adoption Pending
          </Badge>
        );
      case "adopted":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Already Adopted
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Adopt ${adoptionListing.name} - ${adoptionListing.breed} | Petrosia`}</title>
        <meta 
          name="description" 
          content={`${adoptionListing.name} is a ${formatAge(adoptionListing.age)} ${adoptionListing.breed} looking for a forever home. Located in ${adoptionListing.location}.`} 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-6">
        {/* Back button and share */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/adoption">
            <Button variant="ghost" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Adoption
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleShareClick}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Images */}
          <div className="md:col-span-2">
            <div className="rounded-lg overflow-hidden mb-4">
              <img
                src={adoptionListing.images[0]}
                alt={adoptionListing.name}
                className="w-full h-auto object-cover rounded-lg"
                style={{ maxHeight: "500px" }}
              />
            </div>
            
            {adoptionListing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mb-6">
                {adoptionListing.images.slice(1).map((img, index) => (
                  <div key={index} className="rounded-md overflow-hidden">
                    <img
                      src={img}
                      alt={`${adoptionListing.name} ${index + 2}`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tabs for additional information */}
            <Tabs defaultValue="about" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="adoption">Adoption Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-4">
                <h3 className="text-lg font-semibold">About {adoptionListing.name}</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {adoptionListing.description}
                </p>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <h3 className="text-lg font-semibold">Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Pet Type</h4>
                      <p className="font-medium">{getPetTypeIcon()} {adoptionListing.petType ? (adoptionListing.petType.charAt(0).toUpperCase() + adoptionListing.petType.slice(1)) : "Unknown"}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Breed</h4>
                      <p className="font-medium">{adoptionListing.breed}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Age</h4>
                      <p className="font-medium">{formatAge(adoptionListing.age)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                      <p className="font-medium">{adoptionListing.gender}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                      <p className="font-medium">{adoptionListing.location}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Temperament</h4>
                      <p className="font-medium">{adoptionListing.temperament}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <h3 className="text-lg font-semibold mt-6">Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    {adoptionListing.isVaccinated ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span>Vaccinated</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {adoptionListing.isNeutered ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span>Neutered/Spayed</span>
                  </div>
                </div>
                
                {adoptionListing.specialNeeds && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Special Needs</h4>
                    <p className="text-gray-700">{adoptionListing.specialNeeds}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="adoption" className="space-y-4">
                <h3 className="text-lg font-semibold">Adoption Information</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                  <div>{getStatusBadge()}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Email</h4>
                    <p className="font-medium">{adoptionListing.contactEmail}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Phone</h4>
                    <p className="font-medium">{adoptionListing.contactPhone}</p>
                  </div>
                </div>
                
                {adoptionListing.applicationLink && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Application Form</h4>
                    <a 
                      href={adoptionListing.applicationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Online Application Form
                    </a>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Summary and actions */}
          <div>
            <div className="sticky top-4">
              <div className="bg-white rounded-lg border p-6 mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h1 className="text-2xl font-bold">{adoptionListing.name}</h1>
                  <Heart className="h-6 w-6 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                </div>
                
                <div className="mb-4">{getStatusBadge()}</div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-gray-500" />
                    <span>{adoptionListing.breed}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{adoptionListing.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>{formatAge(adoptionListing.age)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full gap-2 mb-3" 
                  onClick={handleContactClick}
                  disabled={adoptionListing.status === "adopted"}
                >
                  <MessageCircle className="h-4 w-4" />
                  Enquire About Adoption
                </Button>
                
                {adoptionListing.applicationLink && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(adoptionListing.applicationLink!, '_blank')}
                    disabled={adoptionListing.status === "adopted"}
                  >
                    Fill Adoption Application
                  </Button>
                )}
                
                {adoptionListing.status === "adopted" && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    This pet has already been adopted and is no longer available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}