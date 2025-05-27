import { useQuery } from "@tanstack/react-query";
import { PetListing, PetSpecies } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Loader2, Search, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetaTags from "@/components/common/MetaTags";
import PetListingCard from "@/components/listing/PetListingCard";

// Pet type configuration for consistent styling and icons
export const petTypeConfig = [
  { 
    type: "dog" as PetSpecies, 
    label: "Dogs", 
    icon: "🐕", 
    color: "bg-blue-100 text-blue-800",
    path: "/pets/dogs",
    description: "Find purebred puppies from trusted breeders across India."
  },
  { 
    type: "cat" as PetSpecies, 
    label: "Cats", 
    icon: "🐈", 
    color: "bg-purple-100 text-purple-800",
    path: "/pets/cats",
    description: "Discover a variety of cat breeds for your home." 
  },
  { 
    type: "bird" as PetSpecies, 
    label: "Birds", 
    icon: "🦜", 
    color: "bg-green-100 text-green-800",
    path: "/pets/birds",
    description: "Explore colorful and exotic birds from trusted sellers."
  },
  { 
    type: "fish" as PetSpecies, 
    label: "Fish", 
    icon: "🐠", 
    color: "bg-teal-100 text-teal-800",
    path: "/pets/fish",
    description: "Browse a selection of freshwater and marine fish."
  }
];

const PetsPage = () => {
  const [, setLocation] = useLocation();

  // Fetch featured pets for each category
  const { data: pets, isLoading } = useQuery<PetListing[]>({
    queryKey: ["/api/pet-listings"],
  });

  // Filter a small sample of each pet type to show as featured
  const getFeaturedByType = (type: PetSpecies) => {
    if (!pets) return [];
    return pets
      .filter(pet => pet.petType === type && pet.approved)
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags 
        title="Find Your Perfect Pet | Petrosia"
        description="Browse through dogs, cats, birds, fish and other pets available from trusted breeders and sellers across India. Find your ideal furry, feathery, or finned friend in major Indian cities."
        keywords="pet adoption India, dog adoption, cat adoption, birds for sale, fish for sale, pet sellers, pet breeders, pet listings, Delhi, Mumbai, Bangalore, Kolkata"
        url="https://petrosia.in/pets"
        image="https://petrosia.in/images/pets-page-share.jpg"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Find Your Perfect Pet Companion
          </h1>
          <p className="text-center text-neutral-600 max-w-2xl mx-auto mb-8">
            Browse through our extensive collection of pets from trusted sellers and breeders across India's major cities. Filter by type, breed, and more to find your ideal furry, feathery, or finned friend.
          </p>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {petTypeConfig.map((petType) => (
              <Link key={petType.type} href={petType.path}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center text-center h-full">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl ${petType.color.split(' ')[0]} mb-4`}>
                      {petType.icon}
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold mb-2">{petType.label}</h2>
                    <p className="text-sm text-neutral-600 mb-4 flex-grow">
                      {petType.description}
                    </p>
                    <Button variant="outline" className="w-full mt-auto">
                      Browse {petType.label}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Pets Section */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Featured Pets</h2>

        <Tabs defaultValue="dog" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-8 grid grid-cols-4">
            {petTypeConfig.map((petType) => (
              <TabsTrigger key={petType.type} value={petType.type} className="flex items-center gap-2">
                <span className="hidden md:inline">{petType.icon}</span> 
                {petType.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {petTypeConfig.map((petType) => (
            <TabsContent key={petType.type} value={petType.type}>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
                    {getFeaturedByType(petType.type).length > 0 ? (
                      getFeaturedByType(petType.type).map(pet => (
                        <PetListingCard key={pet.id} listing={pet} />
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-12 bg-muted rounded-lg">
                        <p className="text-muted-foreground">No {petType.label.toLowerCase()} listings available right now.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Link href={petType.path}>
                      <Button variant="outline" className="gap-2">
                        View All {petType.label}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default PetsPage;