import { useQuery } from "@tanstack/react-query";
import { PetListing } from "@shared/schema";
import { Loader2, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useRef, useEffect } from "react";

interface PuppyCarouselProps {
  breedName: string;
}

export default function PuppyCarousel({ breedName }: PuppyCarouselProps) {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(isMobile ? 1 : 3);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Check if media is a video
  const isVideo = (url: string): boolean => {
    if (!url) return false;
    
    // If URL contains the specific Cloudinary video pattern from our app
    if (url.includes('cloudinary.com/djxv1usyv/video/upload/')) {
      return true;
    }
    
    // If URL contains parameters that suggest it's a video
    return url.includes('/video/upload') || 
           url.match(/\.(mp4|webm|mov|avi)$/i) !== null ||
           url.includes('resource_type=video');
  };
  
  // Generate thumbnail URL for Cloudinary videos
  const getVideoThumbnail = (videoUrl: string): string => {
    if (!videoUrl || !videoUrl.includes('cloudinary.com')) {
      return '/video-thumbnail.jpg';
    }
    
    try {
      const urlParts = videoUrl.split('/upload/');
      if (urlParts.length !== 2) return '/video-thumbnail.jpg';
      
      return `${urlParts[0]}/upload/c_fill,h_400,w_400,q_80,so_0/${urlParts[1].replace(/\.(mp4|mov|webm|avi)$/i, '.jpg')}`;
    } catch (error) {
      console.error('Error generating video thumbnail:', error);
      return '/video-thumbnail.jpg';
    }
  };
  
  const { data: listings, isLoading, error } = useQuery<PetListing[]>({
    queryKey: [`/api/pet-listings/breed/${breedName}`],
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Reset current index when listings change or screen size changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [listings]);
  
  // Update visible count based on screen size
  useEffect(() => {
    setVisibleCount(isMobile ? 1 : 3);
    // Reset current index when screen size changes to avoid showing blank slides
    setCurrentIndex(0);
  }, [isMobile]);
  
  // Calculate max index based on visible count
  const maxIndex = listings && listings.length > visibleCount ? listings.length - visibleCount : 0;
  
  // Handle navigation
  const next = () => {
    if (!listings?.length) return;
    setCurrentIndex((prevIndex) => 
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };
  
  const prev = () => {
    if (!listings?.length) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
  };

  // Check if carousel should be displayed
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !listings || listings.length === 0) {
    return null; // Don't display carousel if no puppies available
  }
  
  // Calculate slide width based on visible count
  const slideWidth = 100 / visibleCount;
  
  return (
    <div className="relative mt-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Available Puppies</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={prev}
            disabled={listings.length <= visibleCount}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={next}
            disabled={listings.length <= visibleCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={carouselRef} 
        className="relative overflow-hidden rounded-md"
      >
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * slideWidth}%)`,
          }}
        >
          {listings.map((listing, index) => (
            <div 
              key={listing.id} 
              className="flex-shrink-0 px-2"
              style={{ width: `${slideWidth}%` }}
            >
              <Link href={`/listings/${listing.id}`}>
                <Card className="overflow-hidden cursor-pointer h-full hover:shadow-md transition-shadow border">
                  <div className="relative h-48 overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <>
                        {isVideo(listing.images[0]) ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={getVideoThumbnail(listing.images[0])} 
                              alt={listing.title}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                            <Badge 
                              className="absolute bottom-2 right-2 z-10 bg-black/60 text-white"
                            >
                              <Play className="h-3 w-3 mr-1" fill="white" /> Video
                            </Badge>
                          </div>
                        ) : (
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <p className="text-muted-foreground text-sm">No image</p>
                      </div>
                    )}
                    <Badge 
                      className="absolute top-2 right-2 bg-primary text-white"
                    >
                      {listing.age < 12 
                        ? `${listing.age} months` 
                        : `${Math.floor(listing.age / 12)} years`}
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm truncate">{listing.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{listing.location}</p>
                    {listing.price && (
                      <p className="text-sm font-semibold mt-1">₹{listing.price.toLocaleString()}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination dots for mobile */}
      {isMobile && listings.length > 1 && (
        <div className="flex justify-center mt-4 space-x-1">
          {Array.from({ length: listings.length }).map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-4 bg-primary' 
                  : 'w-2 bg-muted'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Desktop pagination indicators */}
      {!isMobile && listings.length > visibleCount && (
        <div className="flex justify-center mt-4 space-x-1">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-4 bg-primary' 
                  : 'w-2 bg-muted'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide group ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}