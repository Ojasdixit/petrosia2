import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { PetListing } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/ui/video-player";
import { Heart, Star, Play } from "lucide-react";

interface PetListingCardProps {
  listing: PetListing;
  showViewDetailsButton?: boolean;
}

const PetListingCard: React.FC<PetListingCardProps> = ({
  listing,
  showViewDetailsButton = true,
}) => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Format location (city) for display
  const formatLocation = (location: string) => {
    return location.split(",")[0].trim();
  };

  // Check if media is a video - comprehensive detection with forced checks
  const isVideo = (url: string): boolean => {
    if (!url) return false;
    
    // If URL contains the specific Cloudinary video pattern from our app
    if (url.includes('cloudinary.com/djxv1usyv/video/upload/')) {
      return true;
    }
    
    // If URL contains parameters that suggest it's a video
    return url.includes('/video/upload') || 
           url.match(/\.(mp4|webm|mov|avi)$/i) !== null ||
           url.includes('resource_type=video') ||
           (url.includes('cloudinary.com') && 
            url.includes('/upload/v') && 
            !url.match(/\.(jpg|jpeg|png|gif|webp)$/i));
  };

  // Get first media for display
  const firstMedia = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : "/placeholder-pet.jpg";
    
  // Special check for the known problematic URL
  const isSpecificVideo = firstMedia === "https://res.cloudinary.com/djxv1usyv/video/upload/v1744871783/IMG_7615_hbvvw0.mp4";
  
  // Check if first media is a video - log for debugging
  const hasVideo = isSpecificVideo || (firstMedia && isVideo(firstMedia));
  
  console.log(`Media URL: ${firstMedia}`);
  console.log(`Is specific video? ${isSpecificVideo}`);
  console.log(`Is video detected? ${hasVideo}`);
  
  // Generate thumbnail URL for Cloudinary videos
  const getVideoThumbnail = (videoUrl: string): string => {
    if (!videoUrl || !videoUrl.includes('cloudinary.com')) {
      return '/video-thumbnail.jpg';
    }
    
    // Format: https://res.cloudinary.com/cloud_name/video/upload/v1234567890/public_id.mp4
    // To:     https://res.cloudinary.com/cloud_name/video/upload/c_fill,h_400,w_400,q_80,so_0/v1234567890/public_id.jpg
    try {
      const urlParts = videoUrl.split('/upload/');
      if (urlParts.length !== 2) return '/video-thumbnail.jpg';
      
      return `${urlParts[0]}/upload/c_fill,h_400,w_400,q_80,so_0/${urlParts[1].replace(/\.(mp4|mov|webm|avi)$/i, '.jpg')}`;
    } catch (error) {
      console.error('Error generating video thumbnail:', error);
      return '/video-thumbnail.jpg';
    }
  };
  
  // Get thumbnail URL for the current media
  const thumbnailUrl = hasVideo ? getVideoThumbnail(firstMedia) : firstMedia;

  // Handle "View Details" button click
  const handleViewDetails = () => {
    if (!user) {
      // First save the intended destination
      localStorage.setItem('returnAfterLogin', `/listings/${listing.id}`);
      
      // Use direct window location for more reliable navigation
      window.location.href = '/auth?mode=login';
      return;
    }
    
    // If user is logged in, navigate normally
    setLocation(`/listings/${listing.id}`);
  };
  
  // Format price with commas for thousands
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  // Get pet type data
  const getPetTypeData = (petType: string) => {
    switch (petType) {
      case "dog":
        return { icon: "🐕", label: "Dog", color: "bg-blue-100 text-blue-800" };
      case "cat":
        return { icon: "🐈", label: "Cat", color: "bg-purple-100 text-purple-800" };
      case "bird":
        return { icon: "🦜", label: "Bird", color: "bg-green-100 text-green-800" };
      case "fish":
        return { icon: "🐠", label: "Fish", color: "bg-cyan-100 text-cyan-800" };
      default:
        return { icon: "🐾", label: "Pet", color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <div className={`relative ${hasVideo ? 'aspect-[4/6]' : 'aspect-square'} overflow-hidden`}>
        {listing.isHighlyEnquired && (
          <Badge className="absolute top-2 right-2 z-10 bg-yellow-500">
            <Star className="w-3 h-3 mr-1 fill-current" /> Highly Enquired
          </Badge>
        )}
        <Badge 
          className={`absolute top-2 left-2 z-10 flex items-center ${getPetTypeData(listing.petType).color}`}
        >
          <span className="mr-1">{getPetTypeData(listing.petType).icon}</span>
          {getPetTypeData(listing.petType).label}
        </Badge>
        {hasVideo ? (
          <div className="relative w-full h-full">
            {/* Using the same simpler video approach as PetCard in the home page */}
            <div className="w-full h-full aspect-[4/6] bg-gray-100 flex items-center justify-center">
              <video 
                src={firstMedia}
                className="max-h-full max-w-full object-contain"
                controls={false}
                muted
                playsInline
                preload="metadata"
                onClick={handleViewDetails}
                poster={
                  // Generate a thumbnail from Cloudinary video with better error handling
                  firstMedia.includes('cloudinary.com') 
                    ? firstMedia.replace(/\.(mp4|mov|webm|avi)$/i, '.jpg')
                      .replace('/video/upload/', '/video/upload/w_500,h_700,c_fill,q_80,so_0/')
                    : '/video-thumbnail.jpg'
                }
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Play button overlay */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer" onClick={handleViewDetails}>
                <div className="bg-black/40 rounded-full p-3">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            {/* Video indicator badge */}
            <Badge className="absolute bottom-2 right-2 z-10 bg-black/60 text-white">
              <Play className="h-3 w-3 mr-1" fill="white" /> Video
            </Badge>
            
            {/* Additional info overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent p-3 z-20 pointer-events-none"
            >
              <p className="text-white font-medium truncate text-sm">
                {listing.title}
              </p>
            </div>
          </div>
        ) : (
          <img
            src={firstMedia}
            alt={listing.title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-pet.jpg";
            }}
          />
        )}
      </div>
      <CardHeader className="px-4 pt-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {listing.title}
          </CardTitle>
          <div className={`text-xs font-medium rounded-full px-2 py-1 flex items-center ${getPetTypeData(listing.petType).color}`}>
            <span className="mr-1">{getPetTypeData(listing.petType).icon}</span>
            {getPetTypeData(listing.petType).label}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatLocation(listing.location)}
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-2 flex-grow">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="text-sm">
              <span className="font-medium">Age:</span> {listing.age} months
            </div>
            <div className="text-sm">
              <span className="font-medium">Breed:</span> {listing.breed}
            </div>
          </div>
          <div className="text-sm flex items-center">
            {listing.isVaccinated ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Vaccinated
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-600 border-amber-600">
                Not Vaccinated
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 pt-0 pb-4 flex flex-col gap-2">
        <div className="w-full flex justify-between items-center">
          <div className="text-lg font-bold">
            {user ? (
              listing.price && typeof listing.price === 'number' && !isNaN(listing.price) && listing.price > 0
                ? `₹${formatPrice(listing.price)}`
                : `Contact for price details`
            ) : (
              <span className="text-gray-500 font-normal italic">Login to view prices</span>
            )}
          </div>
          {listing.enquiryCount > 0 && (
            <div className="text-xs text-muted-foreground flex items-center">
              <Heart className="h-3 w-3 mr-1 fill-rose-500 text-rose-500" />
              {listing.enquiryCount} {listing.enquiryCount === 1 ? "enquiry" : "enquiries"}
            </div>
          )}
        </div>
        {showViewDetailsButton && (
          <Button 
            className="w-full" 
            onClick={handleViewDetails}
            variant={user ? "default" : "secondary"}
          >
            {user ? "View Details" : "Login to View"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PetListingCard;