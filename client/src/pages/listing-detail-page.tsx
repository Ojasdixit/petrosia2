import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { PetListing } from "@shared/schema";
import { VideoPlayer } from "@/components/ui/video-player";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import MetaTags from "@/components/common/MetaTags";
import { 
  Loader2, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Check, 
  X, 
  ArrowLeft, 
  Heart,
  Share2,
  Video
} from "lucide-react";

const ListingDetailPage = () => {
  const [match, params] = useRoute<{ id: string }>("/listings/:id");
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, guestLoginMutation } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { data: listing, isLoading, isError } = useQuery<PetListing>({
    queryKey: [`/api/pet-listings/${params?.id}`],
    enabled: !!params?.id && !authLoading,
  });

  // We no longer redirect to login for viewing details
  // Users will be able to view all details except price information
  // Price and contact information will show a prompt to login or register

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleWhatsAppInquiry = () => {
    if (listing) {
      const message = `Hello, I'm interested in your ${listing.breed} listing on Petrosia (ID: ${listing.id})`;
      const whatsappUrl = `https://wa.me/919887805771?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-4">
          Listing Not Found
        </h2>
        <p className="text-neutral-600 mb-6">
          The pet listing you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => {
          // Check if listing path contains pet type hints
          const path = window.location.pathname;
          
          // Try to determine proper navigation from URL
          if (path.includes('/dogs/') || path.includes('dog')) {
            setLocation("/pets/dogs");
          } else if (path.includes('/cats/') || path.includes('cat')) {
            setLocation("/pets/cats");
          } else if (path.includes('/birds/') || path.includes('bird')) {
            setLocation("/pets/birds");
          } else if (path.includes('/fish/') || path.includes('fish')) {
            setLocation("/pets/fish");
          } else {
            // Default to listings
            setLocation("/listings");
          }
        }}>
          <ArrowLeft className="h-4 w-4 mr-2" /> 
          {window.location.pathname.includes('/dogs') ? 'Back to Dogs' :
           window.location.pathname.includes('/cats') ? 'Back to Cats' :
           window.location.pathname.includes('/birds') ? 'Back to Birds' :
           window.location.pathname.includes('/fish') ? 'Back to Fish' :
           'Back to Listings'}
        </Button>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={`${listing.breed} - ${listing.title} | Petrosia`}
        description={listing.description.substring(0, 160)}
        keywords={`${listing.breed}, ${listing.petType}, pet for sale, pet adoption, ${listing.petType} for sale, ${listing.breed} for sale, pet listing, Petrosia, India pet marketplace`}
        url={`https://petrosia.in/listings/${listing.id}`}
        image={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://petrosia.in/images/pet-listing-share.jpg'}
      />

      <div className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              className="p-0 h-auto hover:bg-transparent hover:text-primary"
              onClick={() => {
                // Check referrer path to determine where to navigate back to
                const referrer = document.referrer;
                const referrerPath = referrer ? new URL(referrer).pathname : '';
                
                // Check pet type first to ensure consistent navigation
                if (listing && listing.petType) {
                  if (listing.petType === 'dog') {
                    setLocation("/pets/dogs");
                  } else if (listing.petType === 'cat') {
                    setLocation("/pets/cats");
                  } else if (listing.petType === 'bird') {
                    setLocation("/pets/birds");
                  } else if (listing.petType === 'fish') {
                    setLocation("/pets/fish");
                  } else {
                    // Fallback to referrer path if available
                    if (referrerPath.includes('/pets/dogs')) {
                      setLocation("/pets/dogs");
                    } else if (referrerPath.includes('/pets/cats')) {
                      setLocation("/pets/cats");
                    } else if (referrerPath.includes('/pets/birds')) {
                      setLocation("/pets/birds");
                    } else if (referrerPath.includes('/pets/fish')) {
                      setLocation("/pets/fish");
                    } else if (referrerPath.includes('/pets')) {
                      setLocation("/pets");
                    } else {
                      setLocation("/listings");
                    }
                  }
                } else {
                  // Fallback to referrer path if listing info not available
                  if (referrerPath.includes('/pets/dogs')) {
                    setLocation("/pets/dogs");
                  } else if (referrerPath.includes('/pets/cats')) {
                    setLocation("/pets/cats");
                  } else if (referrerPath.includes('/pets/birds')) {
                    setLocation("/pets/birds");
                  } else if (referrerPath.includes('/pets/fish')) {
                    setLocation("/pets/fish");
                  } else if (referrerPath.includes('/pets')) {
                    setLocation("/pets");
                  } else {
                    setLocation("/listings");
                  }
                }
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> 
              {listing.petType === 'dog' ? 'Back to Dogs' : 
               listing.petType === 'cat' ? 'Back to Cats' : 
               listing.petType === 'bird' ? 'Back to Birds' : 
               listing.petType === 'fish' ? 'Back to Fish' : 
               'Back to Listings'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-2">
              {/* Image Carousel */}
              <Carousel className="w-full rounded-xl overflow-hidden shadow-md bg-white mb-6">
                <CarouselContent>
                  {listing.images.map((mediaUrl, index) => {
                    // Check if the media is a video - comprehensive detection
                    const isVideo = (url: string): boolean => {
                      if (!url) return false;
                      
                      // If URL contains the specific Cloudinary video pattern from our app
                      if (url.includes('cloudinary.com/djxv1usyv/video/upload/')) {
                        console.log(`Video detected: ${url}`);
                        return true;
                      }
                      
                      // Other standard checks
                      return url.includes('/video/upload') || 
                             url.match(/\.(mp4|webm|mov|avi)$/i) !== null ||
                             url.includes('resource_type=video') ||
                             (url.includes('cloudinary.com') && 
                              url.includes('/upload/v') && 
                              !url.match(/\.(jpg|jpeg|png|gif|webp)$/i));
                    };
                    
                    // Execute the function to check if this is a video
                    const isVideoMedia = isVideo(mediaUrl);
                    
                    return (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          {isVideoMedia ? (
                            /* Using the same simple video implementation that works on iOS */
                            <div className="w-full aspect-[4/6] bg-gray-100 flex items-center justify-center relative rounded overflow-hidden">
                              <video 
                                src={mediaUrl}
                                className="max-h-full max-w-full object-contain"
                                controls={true}
                                muted
                                playsInline
                                // @ts-ignore - These attributes help with iOS playback
                                webkit-playsinline="true"
                                x5-playsinline="true"
                                preload="auto"
                                poster={
                                  // Generate a thumbnail from Cloudinary video with better error handling
                                  mediaUrl.includes('cloudinary.com') 
                                    ? mediaUrl.replace(/\.(mp4|mov|webm|avi)$/i, '.jpg')
                                      .replace('/video/upload/', '/video/upload/w_500,h_700,c_fill,q_80,so_0/')
                                    : '/video-thumbnail.jpg'
                                }
                              >
                                <source src={mediaUrl} type="video/mp4" />
                                <source src={mediaUrl} type="video/quicktime" />
                                <source src={mediaUrl} type="video/webm" />
                                Your browser does not support the video tag.
                              </video>
                              
                              {/* Video badge indicator */}
                              <Badge className="absolute top-2 right-2 z-10 bg-black/60 text-white">
                                <Video className="h-3 w-3 mr-1" /> Video
                              </Badge>
                            </div>
                          ) : (
                            <div className="w-full aspect-[4/6] bg-gray-100 rounded overflow-hidden">
                              <img
                                src={mediaUrl}
                                alt={`${listing.breed} - Image ${index + 1}`}
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-pet.jpg';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              {/* Details Section */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-4">
                    About this {listing.breed}
                  </h2>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-neutral-500 mr-2" />
                      <span className="text-neutral-700">
                        {listing.age} {listing.age === 1 ? "month" : "months"} old
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-neutral-500 mr-2" />
                      <span className="text-neutral-700">{listing.location}</span>
                    </div>
                    <div className="flex items-center">
                      {listing.isVaccinated ? (
                        <>
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-700">Vaccinated</span>
                        </>
                      ) : (
                        <>
                          <X className="h-5 w-5 text-red-500 mr-2" />
                          <span className="text-red-700">Not Vaccinated</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-neutral-700 whitespace-pre-line">
                    {listing.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact & Price */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-2xl font-heading font-bold text-neutral-900">
                        {listing.title}
                      </h1>
                      <p className="text-xl font-medium text-primary mt-2">
                        {user ? (
                          listing.price && typeof listing.price === 'number' && !isNaN(listing.price) && listing.price > 0 
                            ? `₹${listing.price.toLocaleString('en-IN')}` 
                            : `Contact for price details`
                        ) : (
                          <span className="flex items-center">
                            <span className="text-neutral-500 text-base">Login to view price</span>
                            <Button 
                              variant="link" 
                              className="ml-2 p-0 h-auto text-primary"
                              onClick={() => {
                                localStorage.setItem('returnAfterLogin', `/listings/${params?.id}`);
                                setLocation('/auth?mode=login');
                              }}
                            >
                              Login
                            </Button>
                          </span>
                        )}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs font-medium">
                      Verified Seller
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-6">
                    {user ? (
                      <Button className="w-full" size="lg" onClick={handleWhatsAppInquiry}>
                        Contact Seller on WhatsApp
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button 
                          className="w-full" 
                          variant="secondary"
                          onClick={() => {
                            if (guestLoginMutation) {
                              guestLoginMutation.mutate();
                            } else {
                              // Fallback if mutation is not available
                              localStorage.setItem('returnAfterLogin', `/listings/${params?.id}`);
                              setLocation('/auth?mode=login');
                            }
                          }}
                          disabled={!!guestLoginMutation && guestLoginMutation.isPending}
                        >
                          {guestLoginMutation && guestLoginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Continuing as Guest
                            </>
                          ) : (
                            "Continue as Guest to Contact"
                          )}
                        </Button>
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            localStorage.setItem('returnAfterLogin', `/listings/${params?.id}`);
                            setLocation('/auth?mode=login');
                          }}
                        >
                          Login or Register
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={toggleFavorite}
                        disabled={!user}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            isFavorite ? "fill-primary text-primary" : ""
                          }`}
                        />
                        {isFavorite ? "Saved" : "Save"}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="font-medium text-neutral-900 mb-4">Seller Guidelines</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">
                          Visit the pet in person before making a decision
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">
                          Ask for vaccination and health records
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">
                          Ensure proper documentation and ownership transfer
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">
                          Report any suspicious activity to Petrosia
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetailPage;
