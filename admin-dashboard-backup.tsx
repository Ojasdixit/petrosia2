import { useState, useRef } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PetListing, DogBreed } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Helmet } from "react-helmet";
import { 
  Loader2, 
  ThumbsUp, 
  ThumbsDown, 
  Trash2, 
  MoreVertical, 
  Eye,
  CheckCircle,
  XCircle,
  ClipboardList,
  Search,
  AlertCircle,
  ImageIcon,
  CalendarIcon,
  UsersIcon,
  PhoneIcon,
  HomeIcon,
  Edit,
  PlusCircle,
  ImagePlus,
  Calendar,
  Users,
  MessageSquare,
  PawPrint,
  Stethoscope,
  Scissors,
  PersonStanding,
  MapPin,
  Dumbbell,
  LayoutGrid
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("listings");
  const [dogBreedSearchTerm, setDogBreedSearchTerm] = useState("");
  
  // Search filters for service providers
  const [searchFilters, setSearchFilters] = useState({
    vets: "",
    groomers: "",
    walkers: "",
    trainers: ""
  });
  
  // Image upload handling
  const [imageUploadDialogOpen, setImageUploadDialogOpen] = useState(false);
  const [imageUploadItem, setImageUploadItem] = useState<{
    id: number;
    type: string;
    currentImage: string;
  } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState<DogBreed | null>(null);
  const [breedDialogOpen, setBreedDialogOpen] = useState(false);
  const [breedDeleteDialogOpen, setBreedDeleteDialogOpen] = useState(false);
  const [breedIdToDelete, setBreedIdToDelete] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get all listings including unapproved ones
  const { data: listings, isLoading } = useQuery<PetListing[]>({
    queryKey: ["/api/admin/pet-listings"],
  });
  
  // Get all dog breeds
  const { 
    data: dogBreeds, 
    isLoading: isLoadingDogBreeds 
  } = useQuery<DogBreed[]>({
    queryKey: ["/api/dog-breeds"],
  });
  
  // Filter dog breeds based on search term
  const filteredDogBreeds = dogBreeds
    ? dogBreeds.filter(breed => 
        breed.name.toLowerCase().includes(dogBreedSearchTerm.toLowerCase()) ||
        breed.group.toLowerCase().includes(dogBreedSearchTerm.toLowerCase()) ||
        breed.size.toLowerCase().includes(dogBreedSearchTerm.toLowerCase())
      )
    : [];
    
  // Update dog breed image mutation
  const updateBreedImageMutation = useMutation({
    mutationFn: async ({ breedId, imageField, imageUrl }: { breedId: number, imageField: 'mainImage' | 'galleryImages', imageUrl: string | string[] }) => {
      const payload = imageField === 'mainImage' 
        ? { mainImage: imageUrl as string } 
        : { galleryImages: imageUrl as string[] };
      
      await apiRequest("PATCH", `/api/dog-breeds/${breedId}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dog-breeds"] });
      setIsUploading(false);
    },
    onError: (error) => {
      console.error("Error updating breed image:", error);
      setIsUploading(false);
    }
  });
  
  // Delete dog breed mutation
  const deleteBreedMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/dog-breeds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dog-breeds"] });
      setBreedDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting dog breed:", error);
    }
  });

  // Filter listings based on search term
  const filteredListings = listings
    ? listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Separate listings by approval status
  const approvedListings = filteredListings.filter((listing) => listing.approved);
  const pendingListings = filteredListings.filter((listing) => !listing.approved);

  // Approve listing mutation
  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/admin/pet-listings/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pet-listings"] });
    },
  });

  // Reject listing mutation
  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/admin/pet-listings/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pet-listings"] });
    },
  });

  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/pet-listings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pet-listings"] });
      setDeleteDialogOpen(false);
    },
  });

  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: number) => {
    rejectMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    setListingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (listingToDelete) {
      deleteMutation.mutate(listingToDelete);
    }
  };
  
  // Handle image upload for dog breeds
  const handleBreedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, breedId: number, imageField: 'mainImage' | 'galleryImages') => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      if (imageField === 'mainImage') {
        // Update main image
        updateBreedImageMutation.mutate({
          breedId,
          imageField: 'mainImage',
          imageUrl: data.url
        });
      } else {
        // Update gallery images - first get the current breed to append to existing gallery
        const breed = dogBreeds?.find(b => b.id === breedId);
        if (breed) {
          const updatedGallery = [...(breed.galleryImages || []), data.url];
          updateBreedImageMutation.mutate({
            breedId,
            imageField: 'galleryImages',
            imageUrl: updatedGallery
          });
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
    }
  };
  
  // Handle removal of a gallery image
  const handleRemoveGalleryImage = (breedId: number, imageUrl: string) => {
    const breed = dogBreeds?.find(b => b.id === breedId);
    if (breed && breed.galleryImages) {
      const updatedGallery = breed.galleryImages.filter(img => img !== imageUrl);
      updateBreedImageMutation.mutate({
        breedId,
        imageField: 'galleryImages',
        imageUrl: updatedGallery
      });
    }
  };
  
  // Handle opening breed delete confirmation dialog
  const handleBreedDeleteClick = (breedId: number) => {
    setBreedIdToDelete(breedId);
    setBreedDeleteDialogOpen(true);
  };
  
  // Confirm breed deletion
  const confirmBreedDelete = () => {
    if (breedIdToDelete) {
      deleteBreedMutation.mutate(breedIdToDelete);
    }
  };

  // Mock slideshow data
  const [slideshowItems, setSlideshowItems] = useState([
    {
      id: 1,
      title: "Welcome to Petrosia",
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
  ]);
  
  // Hero carousel items from the homepage
  const [heroItems, setHeroItems] = useState([
    {
      id: 1,
      type: "event",
      title: "DELHI PUPPER PARTY",
      location: "DELHI, GURGAON",
      date: "28TH APRIL 2025",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bgColor: "bg-[#2E5D4B]"
    },
    {
      id: 2,
      type: "breed",
      name: "HUSKY",
      image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      origin: "SIBERIA",
      energyLevel: "VERY HIGH",
      traits: ["FRIENDLY", "ATHLETIC", "MISCHIEVOUS"],
      bgColor: "bg-gradient-to-r from-orange-600 to-amber-500"
    },
    {
      id: 3,
      type: "app-promo",
      title: "MANAGE YOUR DOG'S LIFE",
      features: ["NEARBY PARKS", "TRACK EXPENSES", "DAILY WALKS", "SAVE MEMORIES"],
      bgColor: "bg-gradient-to-r from-orange-500 to-orange-400",
      image: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      type: "event",
      title: "MUMBAI PUPPER POOL PARTY",
      location: "THANE, MUMBAI",
      date: "13TH APRIL 2025",
      image: "https://static2.tripoto.com/media/filter/nl/img/388225/TripDocument/1527606680_pool3.jpg",
      bgColor: "bg-[#1D4ED8]"
    },
    {
      id: 5,
      type: "breed",
      name: "BOXER",
      image: "https://images.unsplash.com/photo-1543071220-6ee5bf71a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      origin: "GERMANY",
      energyLevel: "HIGH",
      traits: ["LOYAL", "PLAYFUL", "PROTECTIVE"],
      bgColor: "bg-gradient-to-r from-amber-600 to-amber-500"
    }
  ]);

  // Events data - matching the data in the home page
  const [eventItems, setEventItems] = useState([
    {
      id: 1,
      title: "Annual Delhi Dog Show",
      date: "2025-04-28",
      time: "10:00 AM - 5:00 PM",
      location: "Jawaharlal Nehru Stadium, Delhi",
      image: "https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Dog Show",
      bgColor: "bg-amber-500",
      city: "Delhi",
      description: "The biggest dog show in Delhi featuring various breeds, competitions, and awards. Join us for a day of fun with furry friends."
    },
    {
      id: 2,
      title: "Pet Adoption Camp",
      date: "2025-05-15",
      time: "9:00 AM - 3:00 PM",
      location: "City Park, Mumbai",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Adoption",
      bgColor: "bg-blue-500",
      city: "Mumbai",
      description: "Find your forever companion at our adoption camp. Many dogs, cats, and small pets waiting for loving homes."
    },
    {
      id: 3,
      title: "Dog Training Workshop",
      date: "2025-06-05",
      time: "2:00 PM - 6:00 PM",
      location: "Canine Club, Bangalore",
      image: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Training",
      bgColor: "bg-green-500",
      city: "Bangalore",
      description: "Learn essential training techniques from expert trainers. Perfect for new pet parents and those looking to teach new tricks."
    },
    {
      id: 4,
      title: "Mumbai Pupper Pool Party",
      date: "2025-07-03",
      time: "2:00 PM - 6:00 PM",
      location: "Sunshine Resort, Thane",
      image: "https://static2.tripoto.com/media/filter/nl/img/388225/TripDocument/1527606680_pool3.jpg",
      category: "Pool Party",
      bgColor: "bg-orange-500",
      city: "Mumbai",
      description: "A splashing good time for water-loving dogs! Pools, splash pads, and treats for your furry friends."
    },
    {
      id: 5,
      title: "Pet Health Awareness Camp",
      date: "2025-07-25",
      time: "10:00 AM - 4:00 PM",
      location: "Central Community Hall, Chennai",
      image: "https://images.unsplash.com/photo-1612531048118-826c06e9bf5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Health",
      bgColor: "bg-rose-500",
      city: "Chennai",
      description: "Free health checkups, vaccination drives, and expert consultations for all pets. Learn about preventive care."
    },
    {
      id: 6,
      title: "Pet Photography Day",
      date: "2025-08-12",
      time: "11:00 AM - 7:00 PM",
      location: "Artsy Studios, Kolkata",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Photography",
      bgColor: "bg-purple-500",
      city: "Kolkata",
      description: "Professional photography sessions for your pets. Capture beautiful memories with your furry friends."
    }
  ]);

  // Mock service providers data
  const [serviceProviders, setServiceProviders] = useState({
    vets: [
      {
        id: 1,
        name: "Dr. Anika Sharma",
        specialty: "General Veterinarian",
        qualification: "BVSc & AH, MVSc",
        experience: 8,
        rating: 4.8,
        clinic: "PetCare Clinic",
        location: "123 Main Street",
        city: "Delhi",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        hours: "Mon-Sat: 10:00 AM - 7:00 PM",
        services: ["Vaccination", "Surgery", "Dental Care", "X-Ray", "Laboratory"]
      },
      {
        id: 2,
        name: "Dr. Rahul Verma",
        specialty: "Animal Surgeon",
        qualification: "BVSc, MVSc Surgery",
        experience: 12,
        rating: 4.9,
        clinic: "Animal Health Center",
        location: "45 Park Avenue",
        city: "Mumbai",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80", 
        hours: "Mon-Fri: 9:00 AM - 6:00 PM",
        services: ["Advanced Surgery", "Orthopedics", "Emergency Care", "Ultrasound", "ICU"]
      }
    ],
    walkers: [
      {
        id: 1,
        name: "Priya Kapoor",
        age: 28,
        experience: 5,
        rating: 4.7,
        location: "South Extension",
        city: "Delhi",
        image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        hours: "Mon-Fri: 7:00 AM - 11:00 AM, 4:00 PM - 7:00 PM",
        petTypes: ["Dogs", "Cats"],
        services: ["Walking", "Running", "Pet Sitting", "Medication Administration"],
        priceRange: "₹300 - ₹800 per session"
      },
      {
        id: 2,
        name: "Vikram Singh",
        age: 32,
        experience: 7,
        rating: 4.9,
        location: "Bandra",
        city: "Mumbai",
        image: "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        hours: "Mon-Sun: 6:00 AM - 10:00 AM, 5:00 PM - 8:00 PM",
        petTypes: ["Dogs", "Small Pets"],
        services: ["Walking", "Training", "Pet Sitting", "Park Visits"],
        priceRange: "₹350 - ₹1000 per session"
      }
    ],
    groomers: [
      {
        id: 1,
        name: "Pet Parlour",
        rating: 4.6,
        location: "GTB Nagar",
        city: "Delhi",
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        hours: "Tue-Sun: 11:00 AM - 8:00 PM",
        homeService: true,
        petTypes: ["Dogs", "Cats", "Small Pets"],
        services: ["Bath & Brushing", "Haircut", "Nail Trimming", "Ear Cleaning", "Teeth Brushing"],
        priceRange: "₹500 - ₹2500",
        special: ["Aromatherapy", "Spa Treatments"]
      },
      {
        id: 2,
        name: "Furry Tales",
        rating: 4.8,
        location: "Koramangala",
        city: "Bangalore",
        image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        hours: "Mon-Sat: 10:00 AM - 7:00 PM",
        homeService: true,
        petTypes: ["Dogs", "Cats", "Rabbits"],
        services: ["Premium Grooming", "De-shedding", "Styling", "Pawdicure", "Medicated Baths"],
        priceRange: "₹800 - ₹3000",
        special: ["Organic Products", "Anti-Allergen Treatments"]
      }
    ],
    trainers: [
      {
        id: 1,
        name: "Ajay Khanna",
        specialty: "Behavioral Training",
        experience: 10,
        rating: 4.7,
        location: "Model Town",
        city: "Delhi",
        image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        petTypes: ["Dogs", "Cats"],
        services: ["Obedience Training", "Behavioral Correction", "Puppy Training", "Leash Training"],
        priceRange: "₹800 - ₹2000 per session"
      },
      {
        id: 2,
        name: "Deepika Mehra",
        specialty: "Agility Training",
        experience: 8,
        rating: 4.9,
        location: "Powai",
        city: "Mumbai",
        image: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        petTypes: ["Dogs"],
        services: ["Agility Training", "Competition Prep", "Advanced Commands", "Interactive Play"],
        priceRange: "₹1000 - ₹2500 per session"
      }
    ]
  });
      {
        id: 2,
        name: "Dr. Rahul Verma",
        specialty: "Animal Surgeon",
        qualification: "BVSc, MVSc Surgery",
        experience: 12,
        rating: 4.9,
        clinic: "Animal Health Center",
        location: "45 Park Avenue",
        city: "Mumbai",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80", 
        hours: "Mon-Fri: 9:00 AM - 6:00 PM",
        services: ["Advanced Surgery", "Orthopedics", "Emergency Care", "Ultrasound", "ICU"]
      }
    ],
    walkers: [
      {
        id: 1,
        name: "Priya Kapoor",
        age: 28,
        experience: 5,
        rating: 4.7,
        location: "South Extension",
        city: "Delhi",
        image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        availability: "Mon-Fri: 7:00 AM - 11:00 AM, 4:00 PM - 7:00 PM",
        petTypes: ["Dogs", "Cats"],
        services: ["Walking", "Running", "Pet Sitting", "Medication Administration"],
        priceRange: "₹300 - ₹800 per session"
      },
      {
        id: 2,
        name: "Vikram Singh",
        age: 32,
        experience: 7,
        rating: 4.9,
        location: "Bandra",
        city: "Mumbai",
        image: "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        availability: "Mon-Sun: 6:00 AM - 10:00 AM, 5:00 PM - 8:00 PM",
        petTypes: ["Dogs", "Small Pets"],
        services: ["Walking", "Training", "Pet Sitting", "Park Visits"],
        priceRange: "₹350 - ₹1000 per session"
      }
    ],
    groomers: [
      {
        id: 1,
        name: "Pet Parlour",
        rating: 4.6,
        location: "GTB Nagar",
        city: "Delhi",
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        hours: "Tue-Sun: 11:00 AM - 8:00 PM",
        homeService: true,
        petTypes: ["Dogs", "Cats", "Small Pets"],
        services: ["Bath & Brushing", "Haircut", "Nail Trimming", "Ear Cleaning", "Teeth Brushing"],
        priceRange: "₹500 - ₹2500",
        special: ["Aromatherapy", "Spa Treatments"]
      },
      {
        id: 2,
        name: "Furry Tales",
        rating: 4.8,
        location: "Koramangala",
        city: "Bangalore",
        image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        hours: "Mon-Sat: 10:00 AM - 7:00 PM",
        homeService: true,
        petTypes: ["Dogs", "Cats", "Rabbits"],
        services: ["Premium Grooming", "De-shedding", "Styling", "Pawdicure", "Medicated Baths"],
        priceRange: "₹800 - ₹3000",
        special: ["Organic Products", "Anti-Allergen Treatments"]
      }
    ],
    trainers: [
      {
        id: 1,
        name: "Ajay Khanna",
        specialty: "Behavioral Training",
        experience: 10,
        rating: 4.7,
        location: "Model Town",
        city: "Delhi",
        image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        petTypes: ["Dogs", "Cats"],
        services: ["Obedience Training", "Behavioral Correction", "Puppy Training", "Leash Training"],
        priceRange: "₹800 - ₹2000 per session"
      },
      {
        id: 2,
        name: "Deepika Mehra",
        specialty: "Agility Training",
        experience: 8,
        rating: 4.9,
        location: "Powai",
        city: "Mumbai",
        image: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
        petTypes: ["Dogs"],
        services: ["Agility Training", "Competition Prep", "Advanced Commands", "Interactive Play"],
        priceRange: "₹1000 - ₹2500 per session"
      }
    ]
  });

  // Mock contact information
  const [contactInfo, setContactInfo] = useState({
    phone: "+91 9887805771",
    email: "contact@petrosia.in",
    address: "C29 1st floor bela bhawan nehru nagar adarsh nagar delhi, 110033",
    hours: "Monday - Saturday: 10:00 AM - 7:00 PM",
    socialMedia: {
      facebook: "https://facebook.com/petrosia",
      instagram: "https://instagram.com/petrosia",
      twitter: "https://twitter.com/petrosia"
    }
  });

  // Mock footer content
  const [footerContent, setFooterContent] = useState({
    about: "Petrosia is India's premier marketplace for all pet-related needs. We connect pet lovers with trusted sellers, service providers, and adoption centers.",
    quickLinks: [
      { title: "About Us", url: "/about" },
      { title: "Contact Us", url: "/contact" },
      { title: "Terms & Conditions", url: "/terms" },
      { title: "Privacy Policy", url: "/privacy" },
      { title: "FAQs", url: "/faqs" }
    ],
    categories: [
      { title: "Dogs", url: "/listings?type=dog" },
      { title: "Cats", url: "/pets/cats" },
      { title: "Birds", url: "/pets/birds" },
      { title: "Fish", url: "/pets/fish" },
      { title: "Small Pets", url: "/listings?type=small_pet" }
    ],
    services: [
      { title: "Veterinarians", url: "/services/vets" },
      { title: "Pet Walkers", url: "/services/walkers" },
      { title: "Grooming", url: "/services/grooming" },
      { title: "Health Checkups", url: "/services/checkup" },
      { title: "Pet Delivery", url: "/services/delivery" },
      { title: "Premium Foods", url: "/services/premium-foods" }
    ],
    copyright: "© 2023 Petrosia. All rights reserved."
  });
  
  // Form state for editing items
  const [slideshowEditItem, setSlideshowEditItem] = useState<any>(null);
  const [eventEditItem, setEventEditItem] = useState<any>(null);
  const [serviceEditItem, setServiceEditItem] = useState<any>(null);
  const [serviceTypeEdit, setServiceTypeEdit] = useState<string>("");
  const [heroEditItem, setHeroEditItem] = useState<any>(null);

  // Dialog states
  const [slideshowDialogOpen, setSlideshowDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [footerDialogOpen, setFooterDialogOpen] = useState(false);
  const [heroDialogOpen, setHeroDialogOpen] = useState(false);

  // Handler for adding/editing slideshow item
  const handleSlideshowSave = (item: any) => {
    if (item.id) {
      // Edit existing item
      setSlideshowItems(slideshowItems.map(i => i.id === item.id ? item : i));
    } else {
      // Add new item
      setSlideshowItems([...slideshowItems, { ...item, id: slideshowItems.length + 1 }]);
    }
    setSlideshowDialogOpen(false);
    setSlideshowEditItem(null);
  };

  // Handler for adding/editing event item
  const handleEventSave = (item: any) => {
    if (item.id) {
      // Edit existing item
      setEventItems(eventItems.map(i => i.id === item.id ? item : i));
    } else {
      // Add new item
      setEventItems([...eventItems, { ...item, id: eventItems.length + 1 }]);
    }
    setEventDialogOpen(false);
    setEventEditItem(null);
  };

  // Handler for adding/editing hero item
  const handleHeroSave = (item: any) => {
    if (item.id) {
      // Edit existing item
      setHeroItems(heroItems.map(i => i.id === item.id ? item : i));
    } else {
      // Add new item
      setHeroItems([...heroItems, { ...item, id: heroItems.length + 1 }]);
    }
    setHeroDialogOpen(false);
    setHeroEditItem(null);
  };

  // Handler for adding/editing service provider
  const handleServiceSave = (item: any, type: string) => {
    let updatedProviders;
    
    if (item.id) {
      // Edit existing item
      updatedProviders = serviceProviders[type as keyof typeof serviceProviders].map(
        (i: any) => i.id === item.id ? item : i
      );
    } else {
      // Add new item
      const newId = Math.max(0, ...serviceProviders[type as keyof typeof serviceProviders].map((i: any) => i.id)) + 1;
      updatedProviders = [...serviceProviders[type as keyof typeof serviceProviders], { ...item, id: newId }];
    }
    
    // Update the local state immediately for a responsive UI
    setServiceProviders({
      ...serviceProviders,
      [type]: updatedProviders
    });
    
    // Send update to server
    updateServiceProvidersMutation.mutate({
      type,
      providers: updatedProviders
    });
    
    // Close dialog and reset state
    setServiceDialogOpen(false);
    setServiceEditItem(null);
    setServiceTypeEdit("");
  };

  // Handler for updating contact info
  const handleContactSave = (info: any) => {
    setContactInfo(info);
    setContactDialogOpen(false);
  };

  // Handler for updating footer content
  const handleFooterSave = (content: any) => {
    setFooterContent(content);
    setFooterDialogOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Petrosia</title>
        <meta name="description" content="Admin dashboard for Petrosia" />
      </Helmet>

      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
              Admin Dashboard
            </h1>
            <p className="text-neutral-600">
              Manage website content, listings, and settings
            </p>
          </div>

          {/* Admin Dashboard Tabs */}
          <Tabs
            defaultValue="listings"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <div className="overflow-x-auto">
              <TabsList className="mb-8 border-b w-full justify-start rounded-none p-0 h-auto">
                <TabsTrigger
                  value="listings"
                  className="rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <ClipboardList className="h-4 w-4 mr-2" /> Pet Listings
                </TabsTrigger>
                <TabsTrigger
                  value="slideshow"
                  className="rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <ImageIcon className="h-4 w-4 mr-2" /> Slideshow Cards
                </TabsTrigger>
                <TabsTrigger
                  value="hero"
                  className="rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <LayoutGrid className="h-4 w-4 mr-2" /> Hero Carousel
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <Calendar className="h-4 w-4 mr-2" /> Event Cards
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <Users className="h-4 w-4 mr-2" /> Service Providers
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <PhoneIcon className="h-4 w-4 mr-2" /> Contact Info
                </TabsTrigger>
                <TabsTrigger
                  value="footer"
                  className="rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <MessageSquare className="h-4 w-4 mr-2" /> Footer Content
                </TabsTrigger>
                <TabsTrigger
                  value="adoption"
                  className="rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <PawPrint className="h-4 w-4 mr-2" /> Adoption Listings
                </TabsTrigger>
                <TabsTrigger
                  value="dogBreeds"
                  className="rounded-none px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <PawPrint className="h-4 w-4 mr-2" /> Dog Breeds
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Pet Listings Tab */}
            <TabsContent value="listings" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Pet Listings</h2>
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                  <Input
                    placeholder="Search by title, breed, or location"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-neutral-900">
                      {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      ) : (
                        filteredListings.length
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Approved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      ) : (
                        approvedListings.length
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-amber-500">
                      {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      ) : (
                        pendingListings.length
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="all" className="flex gap-2">
                    <ClipboardList className="h-4 w-4" /> All Listings ({filteredListings.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="flex gap-2">
                    <AlertCircle className="h-4 w-4" /> Pending Approval ({pendingListings.length})
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="flex gap-2">
                    <CheckCircle className="h-4 w-4" /> Approved ({approvedListings.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <AdminListingsTable
                    listings={filteredListings}
                    isLoading={isLoading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    isPendingApprove={approveMutation.isPending}
                    isPendingReject={rejectMutation.isPending}
                  />
                </TabsContent>

                <TabsContent value="pending">
                  <AdminListingsTable
                    listings={pendingListings}
                    isLoading={isLoading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    isPendingApprove={approveMutation.isPending}
                    isPendingReject={rejectMutation.isPending}
                    emptyMessage="No pending listings to approve."
                  />
                </TabsContent>

                <TabsContent value="approved">
                  <AdminListingsTable
                    listings={approvedListings}
                    isLoading={isLoading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    isPendingApprove={approveMutation.isPending}
                    isPendingReject={rejectMutation.isPending}
                    emptyMessage="No approved listings."
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Slideshow Cards Tab */}
            <TabsContent value="slideshow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Slideshow Cards</h2>
                <Button 
                  onClick={() => {
                    setSlideshowEditItem(null);
                    setSlideshowDialogOpen(true);
                  }}
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" /> Add New Card
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slideshowItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="font-bold text-lg">{item.title}</h3>
                          <p className="text-sm text-gray-200">{item.subtitle}</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Button: {item.buttonText}</span>
                        <span className="text-sm text-gray-500">Link: {item.buttonLink}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSlideshowEditItem(item);
                          setSlideshowDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (slideshowItems.length > 1) {
                            setSlideshowItems(slideshowItems.filter(i => i.id !== item.id));
                          } else {
                            alert("You must have at least one slideshow item.");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Event Cards Tab */}
            <TabsContent value="events">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Event Cards</h2>
                <Button 
                  onClick={() => {
                    setEventEditItem(null);
                    setEventDialogOpen(true);
                  }}
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" /> Add New Event
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className={`${item.bgColor} text-white`}>{item.category}</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription>{item.city}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-neutral-700 text-sm line-clamp-2">{item.description}</p>
                      <div className="grid grid-cols-1 gap-2 text-sm text-neutral-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-neutral-400" /> 
                          {item.date ? new Date(item.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : "No date"}
                        </div>
                        <div className="flex items-center">
                          <ClipboardList className="h-4 w-4 mr-2 text-neutral-400" /> 
                          {item.time}
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-neutral-400 mt-0.5" /> 
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEventEditItem(item);
                          setEventDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setEventItems(eventItems.filter(i => i.id !== item.id));
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Hero Carousel Tab */}
            <TabsContent value="hero">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Hero Carousel</h2>
                <Button 
                  onClick={() => {
                    setHeroEditItem(null);
                    setHeroDialogOpen(true);
                  }}
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" /> Add New Item
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className={`relative h-48 ${item.bgColor}`}>
                      <img 
                        src={item.image} 
                        alt={item.type === "breed" ? item.name || "" : item.title || ""} 
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                        {item.type === "event" && (
                          <>
                            <Badge className="w-fit mb-2 bg-white/20 text-white">{item.type.toUpperCase()}</Badge>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-sm text-gray-100 mt-1">{item.location}</p>
                            <p className="text-sm text-gray-100">
                              {item.date && new Date(item.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </>
                        )}
                        {item.type === "breed" && (
                          <>
                            <Badge className="w-fit mb-2 bg-white/20 text-white">{item.type.toUpperCase()}</Badge>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-100 mt-1">Origin: {item.origin}</p>
                            <p className="text-sm text-gray-100">Energy: {item.energyLevel}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.traits && item.traits.map((trait, i) => (
                                <Badge key={i} className="bg-white/30">{trait}</Badge>
                              ))}
                            </div>
                          </>
                        )}
                        {item.type === "app-promo" && (
                          <>
                            <Badge className="w-fit mb-2 bg-white/20 text-white">{item.type.toUpperCase()}</Badge>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.features && item.features.map((feature, i) => (
                                <Badge key={i} className="bg-white/30">{feature}</Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <CardFooter className="p-4 flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setHeroEditItem(item);
                          setHeroDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (heroItems.length > 1) {
                            setHeroItems(heroItems.filter(i => i.id !== item.id));
                          } else {
                            alert("You must have at least one hero carousel item.");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Service Providers Tab */}
            <TabsContent value="services">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Manage Service Providers</h2>
                
                <Tabs defaultValue="vets" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="vets" className="flex gap-2">
                      <Stethoscope className="h-4 w-4" /> Veterinarians
                    </TabsTrigger>
                    <TabsTrigger value="walkers" className="flex gap-2">
                      <PersonStanding className="h-4 w-4" /> Pet Walkers
                    </TabsTrigger>
                    <TabsTrigger value="groomers" className="flex gap-2">
                      <Scissors className="h-4 w-4" /> Groomers
                    </TabsTrigger>
                    <TabsTrigger value="trainers" className="flex gap-2">
                      <Dumbbell className="h-4 w-4" /> Trainers
                    </TabsTrigger>
                  </TabsList>

                  {/* Veterinarians */}
                  <TabsContent value="vets">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Veterinarians</h3>
                      <Button 
                        onClick={() => {
                          setServiceEditItem(null);
                          setServiceTypeEdit("vets");
                          setServiceDialogOpen(true);
                        }}
                        size="sm"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Veterinarian
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {serviceProviders.vets.map((vet) => (
                        <Card key={vet.id}>
                          <CardHeader className="pb-2 flex flex-row space-x-4 items-start">
                            <img 
                              src={vet.image} 
                              alt={vet.name} 
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <CardTitle className="text-lg">{vet.name}</CardTitle>
                              <CardDescription>
                                {vet.specialty} • {vet.city}
                              </CardDescription>
                              <div className="mt-1 flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(vet.rating) ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 15.274l6.188 3.638-1.651-7.125 5.547-4.875-7.313-.627L10 0l-2.771 6.285-7.313.627 5.547 4.875-1.651 7.125z"
                                    />
                                  </svg>
                                ))}
                                <span className="ml-1 text-sm text-gray-600">{vet.rating}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Clinic:</span> {vet.clinic}
                              </div>
                              <div>
                                <span className="font-medium">Address:</span> {vet.location}, {vet.city}
                              </div>
                              <div>
                                <span className="font-medium">Hours:</span> {vet.hours}
                              </div>
                              <div>
                                <span className="font-medium">Experience:</span> {vet.experience} years
                              </div>
                              <div>
                                <span className="font-medium">Services:</span> {vet.services.join(", ")}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0 flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setServiceEditItem(vet);
                                setServiceTypeEdit("vets");
                                setServiceDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setServiceProviders({
                                  ...serviceProviders,
                                  vets: serviceProviders.vets.filter(v => v.id !== vet.id)
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Pet Walkers */}
                  <TabsContent value="walkers">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Pet Walkers</h3>
                      <Button 
                        onClick={() => {
                          setServiceEditItem(null);
                          setServiceTypeEdit("walkers");
                          setServiceDialogOpen(true);
                        }}
                        size="sm"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Walker
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {serviceProviders.walkers.map((walker) => (
                        <Card key={walker.id}>
                          <CardHeader className="pb-2 flex flex-row space-x-4 items-start">
                            <img 
                              src={walker.image} 
                              alt={walker.name} 
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <CardTitle className="text-lg">{walker.name}</CardTitle>
                              <CardDescription>
                                {walker.age} years • {walker.city}
                              </CardDescription>
                              <div className="mt-1 flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(walker.rating) ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 15.274l6.188 3.638-1.651-7.125 5.547-4.875-7.313-.627L10 0l-2.771 6.285-7.313.627 5.547 4.875-1.651 7.125z"
                                    />
                                  </svg>
                                ))}
                                <span className="ml-1 text-sm text-gray-600">{walker.rating}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Area:</span> {walker.location}, {walker.city}
                              </div>
                              <div>
                                <span className="font-medium">Experience:</span> {walker.experience} years
                              </div>
                              <div>
                                <span className="font-medium">Availability:</span> {walker.availability}
                              </div>
                              <div>
                                <span className="font-medium">Pet Types:</span> {walker.petTypes.join(", ")}
                              </div>
                              <div>
                                <span className="font-medium">Services:</span> {walker.services.join(", ")}
                              </div>
                              <div>
                                <span className="font-medium">Price Range:</span> {walker.priceRange}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0 flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setServiceEditItem(walker);
                                setServiceTypeEdit("walkers");
                                setServiceDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setServiceProviders({
                                  ...serviceProviders,
                                  walkers: serviceProviders.walkers.filter(w => w.id !== walker.id)
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Groomers */}
                  <TabsContent value="groomers">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Grooming Services</h3>
                      <Button 
                        onClick={() => {
                          setServiceEditItem(null);
                          setServiceTypeEdit("groomers");
                          setServiceDialogOpen(true);
                        }}
                        size="sm"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Groomer
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {serviceProviders.groomers.map((groomer) => (
                        <Card key={groomer.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{groomer.name}</CardTitle>
                                <CardDescription>
                                  {groomer.city}
                                </CardDescription>
                              </div>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(groomer.rating) ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 15.274l6.188 3.638-1.651-7.125 5.547-4.875-7.313-.627L10 0l-2.771 6.285-7.313.627 5.547 4.875-1.651 7.125z"
                                    />
                                  </svg>
                                ))}
                                <span className="ml-1 text-sm text-gray-600">{groomer.rating}</span>
                              </div>
                            </div>
                            {groomer.homeService && (
                              <Badge className="mt-2 bg-green-100 text-green-800">Home Service Available</Badge>
                            )}
                          </CardHeader>
                          <CardContent className="text-sm">
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Location:</span> {groomer.location}, {groomer.city}
                              </div>
                              <div>
                                <span className="font-medium">Hours:</span> {groomer.hours}
                              </div>
                              <div>
                                <span className="font-medium">Pet Types:</span> {groomer.petTypes.join(", ")}
                              </div>
                              <div>
                                <span className="font-medium">Services:</span> {groomer.services.join(", ")}
                              </div>
                              <div>
                                <span className="font-medium">Price Range:</span> {groomer.priceRange}
                              </div>
                              {groomer.special.length > 0 && (
                                <div>
                                  <span className="font-medium">Special Offerings:</span> {groomer.special.join(", ")}
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0 flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setServiceEditItem(groomer);
                                setServiceTypeEdit("groomers");
                                setServiceDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setServiceProviders({
                                  ...serviceProviders,
                                  groomers: serviceProviders.groomers.filter(g => g.id !== groomer.id)
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Trainers */}
                  <TabsContent value="trainers">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Pet Trainers</h3>
                      <Button 
                        onClick={() => {
                          setServiceEditItem(null);
                          setServiceTypeEdit("trainers");
                          setServiceDialogOpen(true);
                        }}
                        size="sm"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Trainer
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {serviceProviders.trainers.map((trainer) => (
                        <Card key={trainer.id}>
                          <CardHeader className="pb-2 flex flex-row space-x-4 items-start">
                            <img 
                              src={trainer.image} 
                              alt={trainer.name} 
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <CardTitle className="text-lg">{trainer.name}</CardTitle>
                              <CardDescription>
                                {trainer.specialty} • {trainer.city}
                              </CardDescription>
                              <div className="mt-1 flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(trainer.rating) ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 15.274l6.188 3.638-1.651-7.125 5.547-4.875-7.313-.627L10 0l-2.771 6.285-7.313.627 5.547 4.875-1.651 7.125z"
                                    />
                                  </svg>
                                ))}
                                <span className="ml-1 text-sm text-gray-600">{trainer.rating}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Location:</span> {trainer.location}, {trainer.city}
                              </div>
                              <div>
                                <span className="font-medium">Experience:</span> {trainer.experience} years
                              </div>
                              <div>
                                <span className="font-medium">Pet Types:</span> {trainer.petTypes.join(", ")}
                              </div>
                              <div>
                                <span className="font-medium">Services:</span> {trainer.services.join(", ")}
                              </div>
                              <div>
                                <span className="font-medium">Price Range:</span> {trainer.priceRange}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0 flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setServiceEditItem(trainer);
                                setServiceTypeEdit("trainers");
                                setServiceDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setServiceProviders({
                                  ...serviceProviders,
                                  trainers: serviceProviders.trainers.filter(t => t.id !== trainer.id)
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            {/* Contact Info Tab */}
            <TabsContent value="contact">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Contact Information</h2>
                <Button
                  onClick={() => setContactDialogOpen(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" /> Edit Contact Info
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                  <CardDescription>This information is displayed on your contact page and footer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <PhoneIcon className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                        <div>
                          <h3 className="font-medium">Phone Number</h3>
                          <p>{contactInfo.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MessageSquare className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                        <div>
                          <h3 className="font-medium">Email</h3>
                          <p>{contactInfo.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <HomeIcon className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                        <div>
                          <h3 className="font-medium">Address</h3>
                          <p>{contactInfo.address}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <ClipboardList className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                        <div>
                          <h3 className="font-medium">Office Hours</h3>
                          <p>{contactInfo.hours}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                        <div>
                          <h3 className="font-medium">Social Media</h3>
                          <div className="flex gap-4 mt-2">
                            {Object.entries(contactInfo.socialMedia).map(([platform, url]) => (
                              <a 
                                key={platform} 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                              >
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Footer Content Tab */}
            <TabsContent value="footer">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Footer Content</h2>
                <Button
                  onClick={() => setFooterDialogOpen(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" /> Edit Footer Content
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Footer Information</CardTitle>
                  <CardDescription>This content is displayed in your website footer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-lg mb-2">About Text</h3>
                      <p className="text-gray-700">{footerContent.about}</p>

                      <h3 className="font-medium text-lg mt-6 mb-2">Copyright Text</h3>
                      <p className="text-gray-700">{footerContent.copyright}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-medium text-lg mb-2">Quick Links</h3>
                        <ul className="space-y-1">
                          {footerContent.quickLinks.map((link, index) => (
                            <li key={index} className="text-gray-700">
                              {link.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-2">Categories</h3>
                        <ul className="space-y-1">
                          {footerContent.categories.map((link, index) => (
                            <li key={index} className="text-gray-700">
                              {link.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-2">Services</h3>
                        <ul className="space-y-1">
                          {footerContent.services.map((link, index) => (
                            <li key={index} className="text-gray-700">
                              {link.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Adoption Listings Tab */}
            <TabsContent value="adoption">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Adoption Listings</h2>
                <Button 
                  className="gap-2" 
                  onClick={() => window.location.href = "/admin/add-adoption"}
                >
                  <PlusCircle className="h-4 w-4" /> Add New Adoption Listing
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <p className="text-center py-4">
                    Manage adoption listings through the dedicated adoption management page.
                  </p>
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="gap-2"
                      onClick={() => window.location.href = "/adoption"}
                    >
                      <PawPrint className="h-4 w-4" /> Go to Adoption Page
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dog Breeds Tab */}
            <TabsContent value="dogBreeds">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Dog Breeds</h2>
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                  <Input
                    placeholder="Search by breed name, group, or size"
                    className="pl-10"
                    value={dogBreedSearchTerm}
                    onChange={(e) => setDogBreedSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {isLoadingDogBreeds ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDogBreeds.map((breed) => (
                    <Card key={breed.id} className="overflow-hidden flex flex-col">
                      <div className="relative h-48">
                        <img 
                          src={breed.mainImage} 
                          alt={breed.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image";
                          }}
                        />
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                          <Badge className="w-fit mb-2">{breed.size.toUpperCase()}</Badge>
                          <h3 className="font-bold text-xl text-white">{breed.name}</h3>
                          <p className="text-sm text-white/90">Origin: {breed.origin}</p>
                          <p className="text-sm text-white/90">Group: {breed.group}</p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="bg-white/90 hover:bg-white"
                            onClick={() => {
                              if (fileInputRef.current) {
                                fileInputRef.current.setAttribute('data-breed-id', breed.id.toString());
                                fileInputRef.current.setAttribute('data-image-field', 'mainImage');
                                fileInputRef.current.click();
                              }
                            }}
                          >
                            <ImagePlus className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            className="bg-white/90 hover:bg-red-500 text-red-500 hover:text-white"
                            onClick={() => handleBreedDeleteClick(breed.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="flex-grow p-4">
                        <div className="mb-3">
                          <h4 className="font-semibold text-sm text-neutral-500 mb-1">Temperament</h4>
                          <div className="flex flex-wrap gap-1">
                            {breed.temperament.map((temp, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {temp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mb-3">
                          <h4 className="font-semibold text-sm text-neutral-500 mb-1">Characteristics</h4>
                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-600">Energy:</span>
                              <span className="font-medium">{breed.energyLevel}/5</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-600">Training:</span>
                              <span className="font-medium">{breed.trainability}/5</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-600">Shedding:</span>
                              <span className="font-medium">{breed.sheddingAmount}/5</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-600">Grooming:</span>
                              <span className="font-medium">{breed.groomingNeeds}/5</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-neutral-500 mb-1">Gallery Images</h4>
                          {breed.galleryImages && breed.galleryImages.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2 mb-2">
                              {breed.galleryImages.map((img, index) => (
                                <div key={index} className="relative aspect-square bg-neutral-100 rounded overflow-hidden group">
                                  <img 
                                    src={img} 
                                    alt={`${breed.name} gallery ${index+1}`} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "https://placehold.co/200x200/e2e8f0/1e293b?text=Error";
                                    }}
                                  />
                                  <button 
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveGalleryImage(breed.id, img)}
                                  >
                                    <Trash2 className="h-4 w-4 text-white" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-neutral-500 italic mb-2">No gallery images</p>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              if (fileInputRef.current) {
                                fileInputRef.current.setAttribute('data-breed-id', breed.id.toString());
                                fileInputRef.current.setAttribute('data-image-field', 'galleryImages');
                                fileInputRef.current.click();
                              }
                            }}
                          >
                            <ImagePlus className="h-4 w-4 mr-2" /> 
                            Add Gallery Image
                          </Button>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Link 
                          href={`/dog-breeds/${breed.id}`}
                          className="inline-flex items-center text-primary hover:underline"
                        >
                          <Eye className="h-4 w-4 mr-1" /> View Breed Details
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Hidden file input for image uploads */}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const breedId = parseInt(e.target.getAttribute('data-breed-id') || '0');
                  const imageField = e.target.getAttribute('data-image-field') as 'mainImage' | 'galleryImages';
                  
                  if (breedId && imageField) {
                    handleBreedImageUpload(e, breedId, imageField);
                  }
                  
                  // Reset the input
                  e.target.value = '';
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dog Breed Delete Confirmation Dialog */}
      <Dialog open={breedDeleteDialogOpen} onOpenChange={setBreedDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Breed Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this dog breed? This action cannot be undone.
              All breed information, images, and gallery content will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBreedDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmBreedDelete}
              disabled={deleteBreedMutation.isPending}
            >
              {deleteBreedMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete Breed"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Slideshow Edit Dialog */}
      <Dialog open={slideshowDialogOpen} onOpenChange={setSlideshowDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {slideshowEditItem ? "Edit Slideshow Card" : "Add New Slideshow Card"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid w-full items-center gap-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input 
                id="title" 
                defaultValue={slideshowEditItem?.title || ""} 
                placeholder="Enter slideshow card title"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="subtitle" className="text-sm font-medium">Subtitle</label>
              <Input 
                id="subtitle" 
                defaultValue={slideshowEditItem?.subtitle || ""} 
                placeholder="Enter slideshow card subtitle"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="image" className="text-sm font-medium">Image URL</label>
              <Input 
                id="image" 
                defaultValue={slideshowEditItem?.image || ""} 
                placeholder="Enter image URL"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="buttonText" className="text-sm font-medium">Button Text</label>
              <Input 
                id="buttonText" 
                defaultValue={slideshowEditItem?.buttonText || ""} 
                placeholder="Enter button text"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="buttonLink" className="text-sm font-medium">Button Link</label>
              <Input 
                id="buttonLink" 
                defaultValue={slideshowEditItem?.buttonLink || ""} 
                placeholder="Enter button link (e.g., /listings)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSlideshowDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                const title = (document.getElementById("title") as HTMLInputElement).value;
                const subtitle = (document.getElementById("subtitle") as HTMLInputElement).value;
                const image = (document.getElementById("image") as HTMLInputElement).value;
                const buttonText = (document.getElementById("buttonText") as HTMLInputElement).value;
                const buttonLink = (document.getElementById("buttonLink") as HTMLInputElement).value;
                
                if (!title || !subtitle || !image || !buttonText || !buttonLink) {
                  alert("All fields are required!");
                  return;
                }
                
                handleSlideshowSave({
                  id: slideshowEditItem?.id,
                  title,
                  subtitle,
                  image,
                  buttonText,
                  buttonLink
                });
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Edit Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="max-w-lg max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {eventEditItem ? "Edit Event" : "Add New Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid w-full items-center gap-2">
              <label htmlFor="eventTitle" className="text-sm font-medium">Event Title*</label>
              <Input 
                id="eventTitle" 
                defaultValue={eventEditItem?.title || ""} 
                placeholder="Enter event title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-2">
                <label htmlFor="eventDate" className="text-sm font-medium">Date*</label>
                <Input 
                  id="eventDate" 
                  type="date"
                  defaultValue={eventEditItem?.date || ""}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <label htmlFor="eventTime" className="text-sm font-medium">Time*</label>
                <Input 
                  id="eventTime" 
                  defaultValue={eventEditItem?.time || ""} 
                  placeholder="e.g., 10:00 AM - 4:00 PM"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-2">
                <label htmlFor="eventLocation" className="text-sm font-medium">Location*</label>
                <Input 
                  id="eventLocation" 
                  defaultValue={eventEditItem?.location || ""} 
                  placeholder="Enter event location"
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <label htmlFor="eventCity" className="text-sm font-medium">City*</label>
                <select 
                  id="eventCity" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  defaultValue={eventEditItem?.city || ""}
                >
                  <option value="">Select City</option>
                  {["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Pune", "Ahmedabad"].map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="eventDescription" className="text-sm font-medium">Description*</label>
              <Textarea 
                id="eventDescription" 
                defaultValue={eventEditItem?.description || ""} 
                placeholder="Enter event description"
                rows={3}
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="eventImage" className="text-sm font-medium">Image URL*</label>
              <Input 
                id="eventImage" 
                defaultValue={eventEditItem?.image || ""} 
                placeholder="Enter image URL"
              />
              {eventEditItem?.image && (
                <div className="mt-2">
                  <img 
                    src={eventEditItem.image} 
                    alt="Preview" 
                    className="h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-2">
                <label htmlFor="eventCategory" className="text-sm font-medium">Category*</label>
                <Input 
                  id="eventCategory" 
                  defaultValue={eventEditItem?.category || ""} 
                  placeholder="e.g., Adoption, Training"
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <label htmlFor="eventBgColor" className="text-sm font-medium">Background Color Class*</label>
                <select 
                  id="eventBgColor" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  defaultValue={eventEditItem?.bgColor || "bg-blue-500"}
                >
                  <option value="bg-amber-500">Amber</option>
                  <option value="bg-blue-500">Blue</option>
                  <option value="bg-green-500">Green</option>
                  <option value="bg-orange-500">Orange</option>
                  <option value="bg-purple-500">Purple</option>
                  <option value="bg-rose-500">Rose</option>
                  <option value="bg-red-500">Red</option>
                  <option value="bg-teal-500">Teal</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                const title = (document.getElementById("eventTitle") as HTMLInputElement).value;
                const date = (document.getElementById("eventDate") as HTMLInputElement).value;
                const time = (document.getElementById("eventTime") as HTMLInputElement).value;
                const location = (document.getElementById("eventLocation") as HTMLInputElement).value;
                const city = (document.getElementById("eventCity") as HTMLSelectElement).value;
                const description = (document.getElementById("eventDescription") as HTMLTextAreaElement).value;
                const image = (document.getElementById("eventImage") as HTMLInputElement).value;
                const category = (document.getElementById("eventCategory") as HTMLInputElement).value;
                const bgColor = (document.getElementById("eventBgColor") as HTMLSelectElement).value;
                
                if (!title || !date || !time || !location || !city || !description || !image || !category || !bgColor) {
                  alert("All fields are required!");
                  return;
                }
                
                // Store the date in ISO format (YYYY-MM-DD) for consistency and easier sorting
                // We'll format it for display when needed
                
                handleEventSave({
                  id: eventEditItem?.id,
                  title,
                  date: date, // Store in ISO format YYYY-MM-DD
                  time,
                  location,
                  city,
                  description,
                  image,
                  category,
                  bgColor
                });
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Provider Edit Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="max-w-lg max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {serviceEditItem 
                ? `Edit ${serviceTypeEdit === "vets" 
                    ? "Veterinarian" 
                    : serviceTypeEdit === "walkers" 
                    ? "Pet Walker" 
                    : serviceTypeEdit === "groomers" 
                    ? "Groomer" 
                    : "Trainer"}`
                : `Add New ${serviceTypeEdit === "vets" 
                    ? "Veterinarian" 
                    : serviceTypeEdit === "walkers" 
                    ? "Pet Walker" 
                    : serviceTypeEdit === "groomers" 
                    ? "Groomer" 
                    : "Trainer"}`
              }
            </DialogTitle>
          </DialogHeader>
          <ServiceProviderForm 
            type={serviceTypeEdit}
            initialData={serviceEditItem}
            onSave={(data) => handleServiceSave(data, serviceTypeEdit)}
            onCancel={() => setServiceDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Contact Info Edit Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid w-full items-center gap-2">
              <label htmlFor="contactPhone" className="text-sm font-medium">Phone Number</label>
              <Input 
                id="contactPhone" 
                defaultValue={contactInfo.phone} 
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="contactEmail" className="text-sm font-medium">Email</label>
              <Input 
                id="contactEmail" 
                defaultValue={contactInfo.email} 
                placeholder="Enter email address"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="contactAddress" className="text-sm font-medium">Address</label>
              <Input 
                id="contactAddress" 
                defaultValue={contactInfo.address} 
                placeholder="Enter address"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="contactHours" className="text-sm font-medium">Office Hours</label>
              <Input 
                id="contactHours" 
                defaultValue={contactInfo.hours} 
                placeholder="Enter office hours"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Social Media</label>
              <div className="grid w-full items-center gap-2">
                <label htmlFor="contactFacebook" className="text-xs text-gray-500">Facebook</label>
                <Input 
                  id="contactFacebook" 
                  defaultValue={contactInfo.socialMedia.facebook} 
                  placeholder="Enter Facebook URL"
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <label htmlFor="contactInstagram" className="text-xs text-gray-500">Instagram</label>
                <Input 
                  id="contactInstagram" 
                  defaultValue={contactInfo.socialMedia.instagram} 
                  placeholder="Enter Instagram URL"
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <label htmlFor="contactTwitter" className="text-xs text-gray-500">Twitter</label>
                <Input 
                  id="contactTwitter" 
                  defaultValue={contactInfo.socialMedia.twitter} 
                  placeholder="Enter Twitter URL"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                const phone = (document.getElementById("contactPhone") as HTMLInputElement).value;
                const email = (document.getElementById("contactEmail") as HTMLInputElement).value;
                const address = (document.getElementById("contactAddress") as HTMLInputElement).value;
                const hours = (document.getElementById("contactHours") as HTMLInputElement).value;
                const facebook = (document.getElementById("contactFacebook") as HTMLInputElement).value;
                const instagram = (document.getElementById("contactInstagram") as HTMLInputElement).value;
                const twitter = (document.getElementById("contactTwitter") as HTMLInputElement).value;
                
                if (!phone || !email || !address || !hours) {
                  alert("All basic contact fields are required!");
                  return;
                }
                
                handleContactSave({
                  phone,
                  email,
                  address,
                  hours,
                  socialMedia: {
                    facebook,
                    instagram,
                    twitter
                  }
                });
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer Content Edit Dialog */}
      <Dialog open={footerDialogOpen} onOpenChange={setFooterDialogOpen}>
        <DialogContent className="max-w-lg max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Footer Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid w-full items-center gap-2">
              <label htmlFor="footerAbout" className="text-sm font-medium">About Text</label>
              <Textarea 
                id="footerAbout" 
                defaultValue={footerContent.about} 
                placeholder="Enter about text"
                rows={3}
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="footerCopyright" className="text-sm font-medium">Copyright Text</label>
              <Input 
                id="footerCopyright" 
                defaultValue={footerContent.copyright} 
                placeholder="Enter copyright text"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Links, Categories, Services</p>
              <p className="text-xs text-gray-500 italic">
                In a full implementation, these would be editable lists of links.
                For demo purposes, the footer links are simplified and not fully editable.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFooterDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                const about = (document.getElementById("footerAbout") as HTMLTextAreaElement).value;
                const copyright = (document.getElementById("footerCopyright") as HTMLInputElement).value;
                
                if (!about || !copyright) {
                  alert("About and copyright text are required!");
                  return;
                }
                
                handleFooterSave({
                  ...footerContent,
                  about,
                  copyright
                });
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Carousel Dialog */}
      <Dialog open={heroDialogOpen} onOpenChange={setHeroDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Hero Carousel Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="heroType">Type</Label>
              <Select defaultValue={heroEditItem?.type || "event"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="breed">Breed</SelectItem>
                  <SelectItem value="app-promo">App Promo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="heroTitle">Title</Label>
              <Input
                id="heroTitle"
                defaultValue={heroEditItem?.title || heroEditItem?.name || ""}
                ref={(input) => input && heroDialogOpen && input.focus()}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="heroImage">Image URL</Label>
              <Input
                id="heroImage"
                defaultValue={heroEditItem?.image || ""}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="heroBgColor">Background Color</Label>
              <Input
                id="heroBgColor"
                defaultValue={heroEditItem?.bgColor || "bg-[#2E5D4B]"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHeroDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                const type = document.querySelector('[data-radix-select-value]')?.textContent || "event";
                const title = (document.getElementById("heroTitle") as HTMLInputElement).value;
                const image = (document.getElementById("heroImage") as HTMLInputElement).value;
                const bgColor = (document.getElementById("heroBgColor") as HTMLInputElement).value;
                
                const item: any = {
                  id: heroEditItem?.id,
                  type,
                  image,
                  bgColor
                };
                
                if (type === "event") {
                  item.title = title;
                  item.location = heroEditItem?.location || "DELHI, GURGAON";
                  item.date = heroEditItem?.date || new Date("2025-04-28").toISOString().split('T')[0];
                } else if (type === "breed") {
                  item.name = title;
                  item.origin = heroEditItem?.origin || "SIBERIA";
                  item.energyLevel = heroEditItem?.energyLevel || "HIGH";
                  item.traits = heroEditItem?.traits || ["FRIENDLY", "ATHLETIC", "MISCHIEVOUS"];
                } else if (type === "app-promo") {
                  item.title = title;
                  item.features = heroEditItem?.features || ["NEARBY PARKS", "TRACK EXPENSES", "DAILY WALKS", "SAVE MEMORIES"];
                }
                
                handleHeroSave(item);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image upload dialog for service providers */}
      <Dialog open={imageUploadDialogOpen} onOpenChange={setImageUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Provider Image</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {imageUploadItem && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative h-40 w-40">
                    <img 
                      src={imageUploadItem.currentImage || "https://via.placeholder.com/150?text=No+Image"} 
                      alt="Current image" 
                      className="h-40 w-40 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/150?text=No+Image";
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="upload-image">Upload New Image</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="upload-image" 
                      type="file" 
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={async (e) => {
                        if (!e.target.files || e.target.files.length === 0) return;
                        
                        const file = e.target.files[0];
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        try {
                          setUploadingImage(true);
                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          });
                          
                          if (!response.ok) {
                            throw new Error('Failed to upload image');
                          }
                          
                          const data = await response.json();
                          
                          // Update the provider's image
                          if (imageUploadItem.type === "vets") {
                            setServiceProviders({
                              ...serviceProviders,
                              vets: serviceProviders.vets.map(vet => 
                                vet.id === imageUploadItem.id 
                                  ? { ...vet, image: data.url } 
                                  : vet
                              )
                            });
                          } else if (imageUploadItem.type === "groomers") {
                            setServiceProviders({
                              ...serviceProviders,
                              groomers: serviceProviders.groomers.map(groomer => 
                                groomer.id === imageUploadItem.id 
                                  ? { ...groomer, image: data.url } 
                                  : groomer
                              )
                            });
                          } else if (imageUploadItem.type === "walkers") {
                            setServiceProviders({
                              ...serviceProviders,
                              walkers: serviceProviders.walkers.map(walker => 
                                walker.id === imageUploadItem.id 
                                  ? { ...walker, image: data.url } 
                                  : walker
                              )
                            });
                          } else if (imageUploadItem.type === "trainers") {
                            setServiceProviders({
                              ...serviceProviders,
                              trainers: serviceProviders.trainers.map(trainer => 
                                trainer.id === imageUploadItem.id 
                                  ? { ...trainer, image: data.url } 
                                  : trainer
                              )
                            });
                          }
                          
                          setUploadingImage(false);
                          setImageUploadDialogOpen(false);
                        } catch (error) {
                          console.error('Error uploading image:', error);
                          setUploadingImage(false);
                          alert('Failed to upload image. Please try again.');
                        }
                      }}
                    />
                  </div>
                  
                  {uploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-blue-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading image...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageUploadDialogOpen(false)} disabled={uploadingImage}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

type AdminListingsTableProps = {
  listings: PetListing[];
  isLoading: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDelete: (id: number) => void;
  isPendingApprove: boolean;
  isPendingReject: boolean;
  emptyMessage?: string;
};

const AdminListingsTable = ({
  listings,
  isLoading,
  onApprove,
  onReject,
  onDelete,
  isPendingApprove,
  isPendingReject,
  emptyMessage = "No listings found.",
}: AdminListingsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-neutral-300 mb-4" />
          <p className="text-neutral-600">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-neutral-100 text-left">
            <th className="p-4 text-neutral-600 font-medium">Listing</th>
            <th className="p-4 text-neutral-600 font-medium">Seller ID</th>
            <th className="p-4 text-neutral-600 font-medium">Price</th>
            <th className="p-4 text-neutral-600 font-medium">Location</th>
            <th className="p-4 text-neutral-600 font-medium">Status</th>
            <th className="p-4 text-neutral-600 font-medium">Date</th>
            <th className="p-4 text-neutral-600 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-b border-neutral-200 hover:bg-neutral-50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={listing.images[0] || "https://via.placeholder.com/50"}
                    alt={listing.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-neutral-900">{listing.title}</p>
                    <p className="text-sm text-neutral-500">{listing.breed}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-neutral-700">{listing.sellerId}</td>
              <td className="p-4 text-neutral-700">₹{listing.price.toLocaleString()}</td>
              <td className="p-4 text-neutral-700">{listing.location}</td>
              <td className="p-4">
                <Badge 
                  variant={listing.approved ? "outline" : "default"}
                  className={listing.approved 
                    ? "bg-green-100 text-green-800" 
                    : "bg-amber-100 text-amber-800"
                  }
                >
                  {listing.approved ? "Approved" : "Pending"}
                </Badge>
              </td>
              <td className="p-4 text-neutral-700">
                {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : "N/A"}
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/listings/${listing.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  
                  {listing.approved ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onReject(listing.id)}
                      disabled={isPendingReject}
                    >
                      {isPendingReject ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onApprove(listing.id)}
                      disabled={isPendingApprove}
                    >
                      {isPendingApprove ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onDelete(listing.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface ServiceProviderFormProps {
  type: string;
  initialData: any | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ServiceProviderForm = ({ type, initialData, onSave, onCancel }: ServiceProviderFormProps) => {
  // Common fields
  const [name, setName] = useState(initialData?.name || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [rating, setRating] = useState(initialData?.rating || 4.5);
  const [hours, setHours] = useState(initialData?.hours || "");
  
  // File upload references
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Type-specific fields
  const [experience, setExperience] = useState(initialData?.experience || 0);
  const [age, setAge] = useState(initialData?.age || 0);
  const [specialty, setSpecialty] = useState(initialData?.specialty || "");
  const [qualification, setQualification] = useState(initialData?.qualification || "");
  const [clinic, setClinic] = useState(initialData?.clinic || "");
  const [priceRange, setPriceRange] = useState(initialData?.priceRange || "");
  const [homeService, setHomeService] = useState(initialData?.homeService || false);
  
  // Array fields
  const [petTypes, setPetTypes] = useState<string[]>(initialData?.petTypes || []);
  const [services, setServices] = useState<string[]>(initialData?.services || []);
  const [special, setSpecial] = useState<string[]>(initialData?.special || []);
  
  // Helper for array inputs
  const [petTypeInput, setPetTypeInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");
  const [specialInput, setSpecialInput] = useState("");

  // City options
  const cityOptions = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Kolkata",
    "Ahmedabad",
    "Pune",
    "Chennai"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !city || !location || !image || !hours) {
      alert("Please fill in all required fields");
      return;
    }

    const commonData = {
      id: initialData?.id || Math.random(),
      name,
      city,
      location,
      image,
      rating: parseFloat(rating.toString()),
      hours,
    };

    let specificData = {};

    // Add type-specific fields
    if (type === "vets") {
      specificData = {
        specialty,
        qualification,
        experience: parseInt(experience.toString()),
        clinic,
        services,
      };
    } else if (type === "walkers") {
      specificData = {
        age: parseInt(age.toString()),
        experience: parseInt(experience.toString()),
        petTypes,
        services,
        priceRange,
      };
    } else if (type === "groomers") {
      specificData = {
        petTypes,
        services,
        priceRange,
        homeService,
        special,
      };
    } else if (type === "trainers") {
      specificData = {
        specialty,
        experience: parseInt(experience.toString()),
        petTypes,
        services,
        priceRange,
      };
    }

    onSave({ ...commonData, ...specificData });
  };

  // Add to array field
  const addToArray = (input: string, setter: React.Dispatch<React.SetStateAction<string[]>>, inputSetter: React.Dispatch<React.SetStateAction<string>>) => {
    if (input.trim()) {
      setter(prev => [...prev, input.trim()]);
      inputSetter("");
    }
  };

  // Remove from array field
  const removeFromArray = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {/* Common Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid w-full items-center gap-2">
          <label htmlFor="name" className="text-sm font-medium">Name*</label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>

        <div className="grid w-full items-center gap-2">
          <label htmlFor="city" className="text-sm font-medium">City*</label>
          <select 
            id="city" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={city} 
            onChange={(e) => setCity(e.target.value)}
            required
          >
            <option value="">Select City</option>
            {cityOptions.map((cityOption) => (
              <option key={cityOption} value={cityOption}>{cityOption}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid w-full items-center gap-2">
        <label htmlFor="location" className="text-sm font-medium">Location*</label>
        <Input 
          id="location" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter detailed location"
          required
        />
      </div>

      <div className="grid w-full items-center gap-2">
        <label htmlFor="image" className="text-sm font-medium">Provider Image*</label>
        <div className="flex gap-2 items-center">
          <Input 
            id="image" 
            value={image} 
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URL"
            required
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={async (e) => {
              if (!e.target.files || e.target.files.length === 0) return;
              
              const file = e.target.files[0];
              const formData = new FormData();
              formData.append('file', file);
              
              try {
                setIsUploading(true);
                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData,
                });
                
                if (!response.ok) {
                  throw new Error('Failed to upload image');
                }
                
                const data = await response.json();
                setImage(data.url);
                setIsUploading(false);
              } catch (error) {
                console.error('Error uploading image:', error);
                setIsUploading(false);
                alert('Failed to upload image. Please try again or use an image URL.');
              }
            }}
          />
        </div>
        {image && (
          <div className="mt-2">
            <img src={image} alt="Preview" className="h-32 w-32 object-cover rounded" />
            {isUploading && (
              <div className="flex items-center mt-2 text-sm text-blue-500">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading image...
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid w-full items-center gap-2">
          <label htmlFor="rating" className="text-sm font-medium">Rating*</label>
          <Input 
            id="rating" 
            type="number" 
            min="1" 
            max="5" 
            step="0.1"
            value={rating} 
            onChange={(e) => setRating(parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="grid w-full items-center gap-2">
          <label htmlFor="hours" className="text-sm font-medium">Hours*</label>
          <Input 
            id="hours" 
            value={hours} 
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g., 9 AM - 6 PM"
            required
          />
        </div>
      </div>

      {/* Type-specific Fields */}
      {type === "vets" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-2">
              <label htmlFor="specialty" className="text-sm font-medium">Specialty*</label>
              <Input 
                id="specialty" 
                value={specialty} 
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g., Small Animal Medicine"
                required
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <label htmlFor="qualification" className="text-sm font-medium">Qualification*</label>
              <Input 
                id="qualification" 
                value={qualification} 
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g., BVSc & AH, MVSc"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-2">
              <label htmlFor="experience" className="text-sm font-medium">Experience (years)*</label>
              <Input 
                id="experience" 
                type="number" 
                min="0"
                value={experience} 
                onChange={(e) => setExperience(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <label htmlFor="clinic" className="text-sm font-medium">Clinic Name*</label>
              <Input 
                id="clinic" 
                value={clinic} 
                onChange={(e) => setClinic(e.target.value)}
                placeholder="Enter clinic name"
                required
              />
            </div>
          </div>
        </>
      )}

      {type === "walkers" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-2">
              <label htmlFor="age" className="text-sm font-medium">Age*</label>
              <Input 
                id="age" 
                type="number" 
                min="18"
                value={age} 
                onChange={(e) => setAge(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <label htmlFor="experience" className="text-sm font-medium">Experience (years)*</label>
              <Input 
                id="experience" 
                type="number" 
                min="0"
                value={experience} 
                onChange={(e) => setExperience(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-2">
            <label htmlFor="priceRange" className="text-sm font-medium">Price Range*</label>
            <Input 
              id="priceRange" 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
              placeholder="e.g., ₹300 - ₹500 per hour"
              required
            />
          </div>
        </>
      )}

      {type === "groomers" && (
        <>
          <div className="grid w-full items-center gap-2">
            <label htmlFor="priceRange" className="text-sm font-medium">Price Range*</label>
            <Input 
              id="priceRange" 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
              placeholder="e.g., ₹500 - ₹2000"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="homeService" 
              checked={homeService} 
              onChange={(e) => setHomeService(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="homeService" className="text-sm font-medium">Offers Home Service</label>
          </div>
        </>
      )}

      {type === "trainers" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-2">
              <label htmlFor="specialty" className="text-sm font-medium">Specialty*</label>
              <Input 
                id="specialty" 
                value={specialty} 
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g., Obedience Training"
                required
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <label htmlFor="experience" className="text-sm font-medium">Experience (years)*</label>
              <Input 
                id="experience" 
                type="number" 
                min="0"
                value={experience} 
                onChange={(e) => setExperience(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-2">
            <label htmlFor="priceRange" className="text-sm font-medium">Price Range*</label>
            <Input 
              id="priceRange" 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
              placeholder="e.g., ₹5000 - ₹15000 per course"
              required
            />
          </div>
        </>
      )}

      {/* Array Fields - Pet Types */}
      {(type === "walkers" || type === "groomers" || type === "trainers") && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Pet Types*</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {petTypes.map((petType, index) => (
              <Badge key={index} className="bg-primary text-white">
                {petType}
                <button 
                  type="button" 
                  className="ml-1" 
                  onClick={() => removeFromArray(index, setPetTypes)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={petTypeInput}
              onChange={(e) => setPetTypeInput(e.target.value)}
              placeholder="e.g., Dogs, Cats"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => addToArray(petTypeInput, setPetTypes, setPetTypeInput)}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Array Fields - Services */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Services*</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {services.map((service, index) => (
            <Badge key={index} className="bg-primary text-white">
              {service}
              <button 
                type="button" 
                className="ml-1" 
                onClick={() => removeFromArray(index, setServices)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
            placeholder={
              type === "vets" 
                ? "e.g., Vaccinations, Surgery" 
                : type === "walkers" 
                ? "e.g., Daily Walks, Dog Park Visits" 
                : type === "groomers" 
                ? "e.g., Bath & Brush, Nail Trimming" 
                : "e.g., Basic Obedience, Potty Training"
            }
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => addToArray(serviceInput, setServices, setServiceInput)}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Array Fields - Special Offerings (Groomers only) */}
      {type === "groomers" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Special Offerings</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {special.map((item, index) => (
              <Badge key={index} className="bg-primary text-white">
                {item}
                <button 
                  type="button" 
                  className="ml-1" 
                  onClick={() => removeFromArray(index, setSpecial)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={specialInput}
              onChange={(e) => setSpecialInput(e.target.value)}
              placeholder="e.g., Aromatherapy, Spa Treatments"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => addToArray(specialInput, setSpecial, setSpecialInput)}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AdminDashboard;
