import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { PetListing } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, ChevronLeft, ChevronRight, MessageCircle, Play, Flame, TrendingUp, UserRound } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

type PetCardProps = {
  pet: PetListing;
  featured?: boolean;
  isNew?: boolean;
};

const PetCard = ({ pet, featured = false, isNew = false }: PetCardProps) => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  // Initialize favorite state based on whether user has already added to wishlist
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Initialize from local storage if available
  useEffect(() => {
    if (user) {
      // For simplicity, using localStorage to track favorites
      // In a real app, you'd use a backend API to track user wishlists
      const favorites = localStorage.getItem('petFavorites');
      if (favorites) {
        const favoritesArray = JSON.parse(favorites) as number[];
        setIsFavorite(favoritesArray.includes(pet.id));
      }
    }
  }, [user, pet.id]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Extract the images array from the pet - handle different structures
  let images = [];
  try {
    if (Array.isArray(pet.images)) {
      images = pet.images;
    } else if (typeof pet.images === 'string') {
      images = JSON.parse(pet.images);
    } else if (pet.images && typeof pet.images === 'object') {
      // Handle case where images is already an object with url properties
      images = Object.values(pet.images).filter(Boolean);
    }
  } catch (e) {
    console.error("Error parsing images:", e);
    images = [];
  }
  
  // Ensure images is an array even if parsing failed
  if (!Array.isArray(images)) {
    images = [];
  }
  
  // Determine if each item is a video or image with improved detection
  const mediaTypes = images.map((item) => {
    // Handle both string URLs and objects with url property
    const url = typeof item === 'string' ? item : (item && item.url ? item.url : '');
    
    // If we don't have a valid URL string, return a placeholder
    if (!url || typeof url !== 'string') {
      return { 
        url: 'https://images.unsplash.com/photo-1587402092301-725e37c70fd8', 
        isVideo: false 
      };
    }
    
    // Check if URL contains video-related patterns - improved detection
    const isVideo = url.includes('/video/') || 
                    url.endsWith('.mp4') || 
                    url.endsWith('.webm') || 
                    url.endsWith('.mov') || 
                    url.includes('resource_type=video') ||
                    (url.includes('cloudinary.com') && 
                     url.includes('/upload/') && 
                     (url.includes('/video/') || // standard video path
                      url.match(/\.(mp4|webm|mov|avi)$/i) || // check file extension
                      url.includes('/v')));
    return { url, isVideo };
  });
  
  const totalImages = mediaTypes.length;

  // Auto-rotate images for featured pets
  useEffect(() => {
    if (!featured || totalImages <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [featured, totalImages]);

  // Mutation to update wishlist count
  const wishlistMutation = useMutation({
    mutationFn: async (petId: number) => {
      return await apiRequest("POST", `/api/pet-listings/${petId}/wishlist`, { 
        action: isFavorite ? "remove" : "add" 
      });
    },
    onSuccess: () => {
      // Toggle the favorite state
      setIsFavorite(!isFavorite);
      
      // Invalidate the pet listings query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/pet-listings"] });
    }
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      localStorage.setItem('favoriteAfterLogin', String(pet.id));
      localStorage.setItem('returnAfterLogin', window.location.pathname);
      setLocation('/auth?mode=login');
      return;
    }
    
    // Update local storage for favorites
    const favorites = localStorage.getItem('petFavorites');
    let favoritesArray: number[] = favorites ? JSON.parse(favorites) : [];
    
    if (isFavorite) {
      // Remove from favorites
      favoritesArray = favoritesArray.filter(id => id !== pet.id);
    } else {
      // Add to favorites
      favoritesArray.push(pet.id);
    }
    
    // Save updated favorites
    localStorage.setItem('petFavorites', JSON.stringify(favoritesArray));
    
    // Call API to update server-side wishlist count
    wishlistMutation.mutate(pet.id);
  };

  const handleViewDetails = () => {
    if (!user) {
      // First save the intended destination
      localStorage.setItem('returnAfterLogin', `/listings/${pet.id}`);
      
      // Then redirect to auth page
      window.location.href = '/auth?mode=login';
      return;
    }
    
    // If user is logged in, navigate directly
    setLocation(`/listings/${pet.id}`);
  };
  
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? totalImages - 1 : prevIndex - 1));
  };
  
  // Mutation to update enquiry count
  const enquiryMutation = useMutation({
    mutationFn: async (petId: number) => {
      return await apiRequest("POST", `/api/pet-listings/${petId}/enquiry`, {});
    },
    onSuccess: () => {
      // Invalidate the pet listings query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/pet-listings"] });
    }
  });

  const handleEnquire = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Redirect to WhatsApp with pre-filled message
    if (!user) {
      // Store that we want to enquire about this pet after login
      localStorage.setItem('enquireAfterLogin', String(pet.id));
      localStorage.setItem('returnAfterLogin', window.location.pathname);
      
      // Use direct window location to avoid any routing issues
      window.location.href = '/auth?mode=login';
      return;
    }
    
    // If user is logged in, handle the enquiry
    // Increment enquiry count
    enquiryMutation.mutate(pet.id);
    
    // Open WhatsApp with pre-filled message
    const message = `Hi, I'm interested in your pet: ${pet.title} (${pet.breed}). Can you please provide more information?`;
    const whatsappUrl = `https://wa.me/9887805771?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 h-full">
      <div className="relative">
        {mediaTypes[currentImageIndex]?.isVideo ? (
          <div className="w-full aspect-square sm:h-56 bg-gray-100 flex items-center justify-center">
            <video 
              src={mediaTypes[currentImageIndex].url}
              className="max-h-full max-w-full object-contain"
              controls
              muted
              preload="metadata"
              poster={
                // Generate a thumbnail from Cloudinary video
                mediaTypes[currentImageIndex].url.includes('cloudinary.com') 
                  ? mediaTypes[currentImageIndex].url.replace(/\.(mp4|mov|webm|avi)$/, '.jpg')
                    .replace('/video/upload/', '/video/upload/w_500,h_400,c_fill,q_80,so_0/')
                  : 'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=400&q=80'
              }
            >
              Your browser does not support the video tag.
            </video>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
              <div className="bg-black/40 rounded-full p-3">
                <Play className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ) : (
          <img
            src={
              mediaTypes[currentImageIndex]?.url 
                ? (mediaTypes[currentImageIndex].url.startsWith('http') 
                    ? mediaTypes[currentImageIndex].url 
                    : (mediaTypes[currentImageIndex].url.startsWith('/') 
                        ? mediaTypes[currentImageIndex].url 
                        : `/${mediaTypes[currentImageIndex].url}`))
                : 'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=400&q=80'
            }
            alt={`${pet.breed} puppy`}
            className="w-full aspect-square sm:h-56 object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=400&q=80';
            }}
          />
        )}
        
        {/* Navigation arrows - only show if more than one image */}
        {totalImages > 1 && (
          <>
            <button 
              onClick={prevImage}
              className={`absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full ${featured ? 'opacity-70' : 'opacity-0 group-hover:opacity-70'} transition-opacity`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={nextImage}
              className={`absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full ${featured ? 'opacity-70' : 'opacity-0 group-hover:opacity-70'} transition-opacity`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Image indicator dots */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
              {Array.from({ length: totalImages }).map((_, idx) => (
                <span 
                  key={idx} 
                  className={`block h-1.5 w-1.5 rounded-full ${currentImageIndex === idx ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {featured && (
            <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">
              FEATURED
            </Badge>
          )}
          {isNew && !featured && (
            <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5">
              NEW
            </Badge>
          )}
          {/* Show fake "Highly Enquired" indicator with a 40% chance or if it's explicitly set */}
          {(pet.isHighlyEnquired || (!pet.isHighlyEnquired && pet.id % 2 === 0)) && (
            <Badge className="bg-pink-500 text-white text-xs px-2 py-0.5 flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              HIGHLY ENQUIRED
            </Badge>
          )}
          {/* Show selling fast indicator on some listings */}
          {(pet.id % 3 === 0) && (
            <Badge className="bg-purple-500 text-white text-xs px-2 py-0.5 flex items-center gap-1">
              <Flame className="h-3 w-3" />
              SELLING FAST
            </Badge>
          )}
          {/* Add trending badge to some listings */}
          {(pet.id % 5 === 0) && (
            <Badge className="bg-teal-500 text-white text-xs px-2 py-0.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              TRENDING
            </Badge>
          )}

        </div>
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/70 h-7 w-7 p-1.5 rounded-full hover:bg-white transition-colors"
            onClick={toggleFavorite}
          >
            <Heart 
              className={`h-full w-full ${isFavorite ? 'fill-orange-500 text-orange-500' : 'text-gray-600'}`}
            />
          </Button>
          {/* Always show some engagement numbers */}
          <div className="bg-white/70 text-xs px-1.5 py-0.5 rounded text-gray-700 font-medium mt-1 flex items-center">
            <Heart className="h-3 w-3 mr-1 text-orange-500 fill-orange-500" />
            {pet.wishlistCount !== null && pet.wishlistCount !== undefined && pet.wishlistCount > 0 
              ? pet.wishlistCount 
              : Math.floor(10 + Math.random() * 90)} {/* Fake count between 10-99 */}
          </div>
          {/* Add fake enquiry count indicator */}
          <div className="bg-white/70 text-xs px-1.5 py-0.5 rounded text-gray-700 font-medium mt-1 flex items-center">
            <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
            {Math.floor(5 + Math.random() * 15)} enquiries
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">
            {pet.title}
          </h3>
          <Badge variant={pet.isVaccinated ? "default" : "outline"} className={
            pet.isVaccinated 
            ? "bg-green-100 text-green-800 text-[10px] px-1.5 py-0 h-4" 
            : "bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0 h-4"
          }>
            {pet.isVaccinated ? "Vaccinated" : "Not Vaccinated"}
          </Badge>
        </div>

        <h4 className="text-xs font-medium text-gray-500 mb-2">{pet.breed}</h4>

        <div className="flex flex-wrap gap-3 mb-2">
          <div className="text-xs text-gray-600 flex items-center">
            <MapPin className="mr-1 h-3 w-3 flex-shrink-0" /> 
            <span className="truncate">{pet.location}</span>
          </div>
          <div className="text-xs text-gray-600 flex items-center">
            <Calendar className="mr-1 h-3 w-3 flex-shrink-0" /> 
            <span>{pet.age} months</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="font-bold text-amber-600 text-sm sm:text-base mb-2">
            {user ? (
              pet.price && typeof pet.price === 'number' && !isNaN(pet.price) && pet.price > 0 
                ? `₹${pet.price.toLocaleString('en-IN')}` 
                : `Contact for price details`
            ) : (
              <span className="text-gray-500 font-normal italic">Login to view prices</span>
            )}
          </div>
          
          <div className="flex justify-between gap-2">
            <Button
              size="sm"
              onClick={handleViewDetails}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-7 px-3 flex-1"
            >
              View Details
            </Button>
            
            <Button
              size="sm"
              onClick={handleEnquire}
              className="bg-green-500 hover:bg-green-600 text-white text-xs h-7 px-3 flex-1 flex items-center justify-center"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Enquire Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
