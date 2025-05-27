import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { DogBreed } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { TypographyH1, TypographyH2, TypographyP } from "@/components/ui/typography";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DogBreedsPage() {
  const { data: allBreeds, isLoading: isLoadingAll } = useQuery<DogBreed[]>({
    queryKey: ["/api/dog-breeds"],
  });

  const { data: popularBreeds, isLoading: isLoadingPopular } = useQuery<DogBreed[]>({
    queryKey: ["/api/dog-breeds/popular/10"],
  });

  const isMobile = useIsMobile();

  const isLoading = isLoadingAll || isLoadingPopular;
  
  const sizeGroups = {
    small: "Small Dogs (Under 10kg)",
    medium: "Medium Dogs (10-25kg)",
    large: "Large Dogs (25-45kg)",
    giant: "Giant Dogs (45kg+)",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Dog Breeds</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 dark:from-amber-900 dark:to-yellow-800 p-6 md:p-10 rounded-xl mb-8">
        <TypographyH1 className="text-center mb-2">Dog Breeds Information</TypographyH1>
        <TypographyP className="text-center md:w-3/4 mx-auto">
          Explore comprehensive information about various dog breeds, including their temperament,
          physical traits, care requirements, and suitability for different lifestyles.
          Compare breeds side by side to find your perfect canine companion.
        </TypographyP>
      </div>

      <Tabs defaultValue="popular" className="w-full mb-10">
        <TabsList className="w-full flex flex-wrap justify-center mb-6">
          <TabsTrigger value="popular">Popular Breeds</TabsTrigger>
          <TabsTrigger value="by-size">By Size</TabsTrigger>
          <TabsTrigger value="all">All Breeds</TabsTrigger>
          <TabsTrigger value="compare">Compare Breeds</TabsTrigger>
        </TabsList>
        
        <TabsContent value="popular">
          <TypographyH2 className="mb-4">Popular Dog Breeds in India</TypographyH2>
          {isLoadingPopular ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularBreeds?.map((breed) => (
                <BreedCard key={breed.id} breed={breed} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="by-size">
          <TypographyH2 className="mb-4">Browse by Size</TypographyH2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(sizeGroups).map(([size, title]) => (
              <Link key={size} href={`/dog-breeds/size/${size}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                      Browse dog breeds by their size category
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View {title}</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <TypographyH2 className="mb-4">All Dog Breeds</TypographyH2>
          {isLoadingAll ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBreeds?.map((breed) => (
                <BreedCard key={breed.id} breed={breed} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="compare">
          <TypographyH2 className="mb-4">Compare Dog Breeds</TypographyH2>
          <div className="bg-secondary/20 rounded-lg p-6 text-center">
            <TypographyP className="mb-4">
              Select dog breeds you want to compare side by side to find your perfect match.
            </TypographyP>
            <Link href="/dog-breeds/compare">
              <Button>Go to Comparison Tool</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface BreedCardProps {
  breed: DogBreed;
}

function BreedCard({ breed }: BreedCardProps) {
  return (
    <Link href={`/dog-breeds/${breed.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="h-48 overflow-hidden">
          <img 
            src={breed.mainImage || `/images/breeds/${breed.id}.jpg`}
            alt={breed.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = `/images/breeds/default-dog.jpg`;
            }}
          />
        </div>
        <CardHeader>
          <CardTitle>{breed.name}</CardTitle>
          <CardDescription>{breed.group} Group</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline">{breed.size}</Badge>
            <Badge variant="outline">{breed.coat}</Badge>
          </div>
          <TypographyP className="line-clamp-3 text-sm">
            {breed.description}
          </TypographyP>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View Details</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}