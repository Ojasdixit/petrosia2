import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

type PetCategoryProps = {
  type: string;
  count: number;
  image: string;
  bgColor: string;
  textColor: string;
};

const PetCategory = ({ type, count, image, bgColor, textColor }: PetCategoryProps) => {
  const typeForUrl = type.toLowerCase();

  // Create the correct URL based on pet type
  const getLinkUrl = (petType: string) => {
    switch(petType.toLowerCase()) {
      case 'dogs':
        return '/pets/dogs';
      case 'cats':
        return '/pets/cats';
      case 'fish':
        return '/pets/fish';
      case 'birds':
        return '/pets/birds';
      default:
        return '/pets/dogs';
    }
  };

  return (
    <div className={`${bgColor} rounded-lg overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-200 h-28 sm:h-32`}>
      <div className="absolute inset-0 p-3 flex flex-col justify-between z-10">
        <div>
          <h3 className={`text-xl sm:text-2xl font-bold ${textColor}`}>{type}</h3>
          <div className="text-xs text-white/80">{count} BREEDS</div>
        </div>
        <div className="flex justify-between items-end">
          <Link href={getLinkUrl(typeForUrl)}>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/20 border-white/30 hover:bg-white/30 text-white h-7 text-xs px-2 backdrop-blur-sm"
            >
              Explore <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-[1]"></div>

      {/* Image */}
      <img
        src={image}
        alt={`${type} category`}
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
};

const PetCategories = () => {
  const categories = [
    {
      type: "DOGS",
      count: 232,
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bgColor: "bg-amber-500",
      textColor: "text-white",
    },
    {
      type: "CATS",
      count: 49,
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bgColor: "bg-orange-500",
      textColor: "text-white",
    },
    {
      type: "FISH",
      count: 172,
      image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bgColor: "bg-blue-500",
      textColor: "text-white",
    },
    {
      type: "BIRDS",
      count: 42,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_fCVLfcT8N5KdILPeapvZMOak6oxvnficuw&s",
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
  ];

  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-3">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Discover Pet World</h2>
            <p className="text-gray-600 text-sm mt-1">Find your perfect companion</p>
          </div>
          </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((category) => (
            <PetCategory key={category.type} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetCategories;