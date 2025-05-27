import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { DogBreed, DogSize } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { TypographyH1, TypographyH2, TypographyP } from "@/components/ui/typography";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DogBreedsBySizePage() {
  const { size } = useParams<{ size: string }>();
  const dogSize = size as DogSize;
  
  const { data: breeds, isLoading, error } = useQuery<DogBreed[]>({
    queryKey: [`/api/dog-breeds/size/${dogSize}`],
  });

  const isMobile = useIsMobile();

  const sizeLabels = {
    small: "Small Dogs (Under 10kg)",
    medium: "Medium Dogs (10-25kg)",
    large: "Large Dogs (25-45kg)",
    giant: "Giant Dogs (45kg+)",
  };

  const sizeDescriptions = {
    small: "Small dogs are perfect for apartment living, often require less exercise, and can be easier to handle. Their smaller size makes them great for those with limited space or mobility issues.",
    medium: "Medium-sized dogs offer a balance between size and adaptability. They're typically versatile companions that can thrive in various living situations while still being manageable in size.",
    large: "Large dogs provide a commanding presence and often excel as working or guardian dogs. They typically need more space and exercise but offer unwavering loyalty and strength.",
    giant: "Giant breeds are the gentle giants of the dog world. Despite their impressive size, many are known for their calm temperaments. They require ample space and specific care considerations.",
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !breeds) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <TypographyH1 className="mb-4">Error Loading Breeds</TypographyH1>
        <TypographyP className="mb-6">Sorry, we couldn't load the dog breeds information.</TypographyP>
        <Link href="/dog-breeds">
          <Button>Back to All Breeds</Button>
        </Link>
      </div>
    );
  }

  if (!["small", "medium", "large", "giant"].includes(dogSize)) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <TypographyH1 className="mb-4">Invalid Size Category</TypographyH1>
        <TypographyP className="mb-6">The dog size category you requested doesn't exist.</TypographyP>
        <Link href="/dog-breeds">
          <Button>Back to All Breeds</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dog-breeds">Dog Breeds</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>{sizeLabels[dogSize]}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 dark:from-amber-900 dark:to-yellow-800 p-6 md:p-10 rounded-xl mb-8">
        <TypographyH1 className="text-center mb-2">{sizeLabels[dogSize]}</TypographyH1>
        <TypographyP className="text-center md:w-3/4 mx-auto">
          {sizeDescriptions[dogSize]}
        </TypographyP>
      </div>

      {breeds.length === 0 ? (
        <div className="text-center py-12">
          <TypographyH2 className="mb-4">No Breeds Found</TypographyH2>
          <TypographyP className="mb-6">We currently don't have any breeds listed in this size category.</TypographyP>
          <Link href="/dog-breeds">
            <Button>View All Breeds</Button>
          </Link>
        </div>
      ) : (
        <>
          <TypographyH2 className="mb-6">{breeds.length} {dogSize} Dog Breeds</TypographyH2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {breeds.map((breed) => (
              <BreedCard key={breed.id} breed={breed} />
            ))}
          </div>
        </>
      )}
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
            src={breed.mainImage} 
            alt={breed.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <CardHeader>
          <CardTitle>{breed.name}</CardTitle>
          <CardDescription>{breed.group} Group</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline">{breed.coat}</Badge>
            {breed.temperament.slice(0, 2).map((trait, index) => (
              <Badge key={index} variant="secondary">{trait}</Badge>
            ))}
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