import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// Define the type for slideshow items
type SlideshowItem = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
};

// Default slideshow items to use while loading or if API fails
const defaultSlideshowItems: SlideshowItem[] = [
  {
    id: 1,
    title: "Find Your Perfect Pet",
    subtitle: "Find Your Perfect Pet Companion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
    buttonText: "Explore Now",
    buttonLink: "/listings"
  },
  {
    id: 2,
    title: "Adoption Drive",
    subtitle: "Give a forever home to a pet in need",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
    buttonText: "Adopt Now",
    buttonLink: "/adoption"
  },
  {
    id: 3,
    title: "Premium Pet Care",
    subtitle: "Quality services for your beloved pets",
    image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
    buttonText: "View Services",
    buttonLink: "/services/vets"
  }
];

const AdminSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Fetch slideshow items from an API endpoint
  // For now, we'll use the default items since there's no actual API endpoint for this
  const { data: slideshowItems = defaultSlideshowItems, isLoading } = useQuery({
    queryKey: ['/api/slideshow-items'],
    queryFn: async () => {
      // In a real implementation, we would fetch from the API
      // For now, just return the default items after a short delay to simulate an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return defaultSlideshowItems;
    }
  });
  
  const totalSlides = slideshowItems.length;
  
  // Auto rotate through slides
  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides, isLoading]);
  
  return (
    <div className="mb-8">
      {/* Main Heading */}
      <div className="text-center py-6">
        <h1 className="text-2xl md:text-4xl font-bold text-[#333]">
          India's Ultimate Hub for Pet Lovers
        </h1>
      </div>

      {/* Slideshow Container */}
      <div className="container mx-auto px-3 relative">
        {/* Mobile view (full-width cards, one at a time) */}
        <div className="relative w-full overflow-hidden md:hidden">
          <div 
            className="flex flex-nowrap transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slideshowItems.map((item, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="aspect-[7/4] relative">
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <img 
                      src={item.image}
                      alt={item.title} 
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                      <div>
                        <h2 className="text-2xl font-bold">{item.title}</h2>
                        <p className="mt-1 text-sm md:text-base opacity-90">{item.subtitle}</p>
                      </div>
                      <Link href={item.buttonLink}>
                        <Button variant="secondary" className="text-sm md:text-base self-start">
                          {item.buttonText}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile navigation arrows */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full z-20"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full z-20"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        {/* Desktop view (show one card and part of the next) */}
        <div className="relative hidden md:block overflow-hidden">
          <div 
            className="flex flex-nowrap transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 80}%)` }}
          >
            {/* Duplicate first items at the end for infinite loop effect */}
            {[...slideshowItems, ...slideshowItems.slice(0, 2)].map((item, index) => (
              <div key={index} className="w-4/5 pr-4 flex-shrink-0">
                <div className="aspect-[7/4] relative">
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <img 
                      src={item.image}
                      alt={item.title} 
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold">{item.title}</h2>
                        <p className="mt-2 text-lg md:text-xl opacity-90">{item.subtitle}</p>
                      </div>
                      <Link href={item.buttonLink}>
                        <Button 
                          size="lg" 
                          variant="secondary"
                          className="md:text-lg hover:bg-white/90 transition-all duration-200"
                        >
                          {item.buttonText}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop navigation arrows */}
          <button 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
            onClick={() => {
              if (currentSlide === 0) {
                // Jump to the end duplicates without animation
                setTimeout(() => setCurrentSlide(totalSlides - 1), 10);
              } else {
                setCurrentSlide((prev) => prev - 1);
              }
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
            onClick={() => {
              if (currentSlide >= totalSlides - 1) {
                // Jump to the beginning duplicates without animation
                setTimeout(() => setCurrentSlide(0), 10);
              } else {
                setCurrentSlide((prev) => prev + 1);
              }
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center mt-4 mb-2 space-x-2">
          {slideshowItems.map((_, index) => (
            <button 
              key={index} 
              className={`h-2 w-2 rounded-full ${currentSlide === index ? 'bg-orange-500' : 'bg-gray-300'}`}
              onClick={() => {
                // If we're on desktop and at the end duplicates, go to the actual slides
                if (index < totalSlides) {
                  setCurrentSlide(index);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Find your furry friend button */}
      <div className="flex justify-center">
        <Link href="/listings" className="relative inline-flex items-center px-8 py-3 overflow-hidden font-medium transition-all bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 rounded-full hover:bg-orange-600 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 active:shadow-lg">
          <span className="relative">Find your furry friend now</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSlideshow;