import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { insertPetListingSchema, PetListing, DogBreed, PetSpecies } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Extend the insertPetListingSchema for client-side validation
const formSchema = insertPetListingSchema
  .omit({ sellerId: true, approved: true })
  .extend({
    images: z.array(z.string()).min(1, "At least one image URL is required"),
    age: z
      .number()
      .int()
      .positive("Age must be a positive number")
      .or(z.string().regex(/^\d+$/).transform(Number)),
    price: z
      .number()
      .int()
      .positive("Price must be a positive number")
      .or(z.string().regex(/^\d+$/).transform(Number)),
  });

type FormValues = z.infer<typeof formSchema>;

interface ListingFormProps {
  existingListing?: PetListing;
  isEdit?: boolean;
}

const ListingForm = ({ existingListing, isEdit = false }: ListingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [uploadedFiles, setUploadedFiles] = useState<{url: string, type: 'image' | 'video'}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch all dog breeds
  const { data: dogBreeds, isLoading: isLoadingBreeds } = useQuery<DogBreed[]>({
    queryKey: ['/api/dog-breeds'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Initialize form with existing values or defaults
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: existingListing
      ? {
          ...existingListing,
        }
      : {
          title: "",
          breed: "",
          petType: "dog",
          age: 0,
          location: "",
          price: 0,
          description: "",
          isVaccinated: false,
          images: [""],
        },
  });

  // Update form values when existing listing changes
  useEffect(() => {
    if (existingListing) {
      form.reset({
        ...existingListing,
      });
      setImageUrls(existingListing.images);
      
      // Create uploaded files entries from existing images
      const existingImageFiles = existingListing.images.map(url => ({
        url,
        type: 'image' as const
      }));
      setUploadedFiles(existingImageFiles);
    }
  }, [existingListing, form]);

  // Add an image URL field
  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  // Remove an image URL field
  const removeImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      const updatedUrls = [...imageUrls];
      updatedUrls.splice(index, 1);
      setImageUrls(updatedUrls);
      form.setValue(
        "images",
        updatedUrls.filter((url) => url),
        { shouldValidate: true }
      );
    }
  };

  // Handle image URL change
  const handleImageUrlChange = (value: string, index: number) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
    form.setValue(
      "images",
      updatedUrls.filter((url) => url),
      { shouldValidate: true }
    );
  };

  // Update listing media mutation - to keep the media URLs in the listing
  const updateListingMediaMutation = useMutation({
    mutationFn: async ({ id, mediaUrls }: { id: number, mediaUrls: string[] }) => {
      const res = await apiRequest("POST", `/api/pet-listings/${id}/update-media`, { mediaUrls });
      return res.json();
    },
    onSuccess: (data) => {
      console.log('Media URLs updated in listing:', data);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/pet-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seller/pet-listings"] });
      if (existingListing) {
        queryClient.invalidateQueries({ queryKey: [`/api/pet-listings/${existingListing.id}`] });
      }
    },
    onError: (error: Error) => {
      console.error('Error updating listing media:', error);
      toast({
        title: 'Error saving media to listing',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Use XMLHttpRequest for file uploads - more reliable approach
  const uploadFilesMutation = useMutation<{files?: Array<{url: string, type: string}>}, Error, FileList>({
    mutationFn: async (files: FileList) => {
      setIsUploading(true);
      // Use XMLHttpRequest instead of fetch for more control
      return new Promise<{files?: Array<{url: string, type: string}>}>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        
        // Add files to form data
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
        
        // Setup event handlers
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data);
            } catch (e) {
              console.error('Error parsing response:', e);
              reject(new Error('Could not parse server response'));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error during upload'));
        };
        
        // Send the request
        xhr.open('POST', '/api/upload/pet-media', true);
        xhr.withCredentials = true; // Include cookies for auth
        xhr.send(formData);
      });
    },
    onSuccess: (data: {files?: Array<{url: string, type?: string, resourceType?: string}>}) => {
      try {
        if (!data || !data.files || !Array.isArray(data.files)) {
          throw new Error('Invalid response data format');
        }
        
        // Add the uploaded files to the state
        const newFiles = data.files.map((file) => {
          // Determine file type from the server response
          const fileType = file.type || file.resourceType || 'image';
          
          return {
            url: file.url || '',
            type: (fileType === 'video' ? 'video' : 'image') as 'image' | 'video'
          };
        });
        
        console.log('New files with types:', newFiles);
        setUploadedFiles([...uploadedFiles, ...newFiles]);
        
        // Add all media URLs to the form - both images and videos
        const newMediaUrls = newFiles
          .filter((file: any) => file.url)
          .map((file: any) => file.url);
        
        const allUrls = [...imageUrls.filter(url => url), ...newMediaUrls];
        
        setImageUrls(allUrls);
        form.setValue('images', allUrls, { shouldValidate: true });
        
        // CRITICAL: If we're editing an existing listing, immediately update the listing
        // with the new media URLs to ensure they're saved persistently in the database
        if (existingListing && existingListing.id) {
          updateListingMediaMutation.mutate({ 
            id: existingListing.id, 
            mediaUrls: allUrls
          });
        }
        
        toast({
          title: 'Files uploaded successfully',
          description: `${newFiles.length} file(s) uploaded.`,
        });
      } catch (error) {
        console.error('Error processing response:', error);
        toast({
          title: 'Error processing uploaded files',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error uploading files',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  });

  // Handle file selection with file size validation and compression options
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to array for easier processing
      const filesArray = Array.from(e.target.files);
      
      // Check if any file is larger than 10MB (10 * 1024 * 1024 bytes)
      const largeFiles = filesArray.filter(file => file.size > 10 * 1024 * 1024);
      
      if (largeFiles.length > 0) {
        toast({
          title: "Large file detected",
          description: "Some files are large which may take longer to upload. Please be patient.",
          duration: 5000,
        });
      }
      
      // Proceed with upload
      uploadFilesMutation.mutate(e.target.files);
    }
  };

  // Remove an uploaded file
  const removeUploadedFile = (index: number) => {
    const updatedFiles = [...uploadedFiles];
    const removedFile = updatedFiles.splice(index, 1)[0];
    setUploadedFiles(updatedFiles);
    
    // Remove from images array if it's an image
    if (removedFile.type === 'image') {
      const updatedImageUrls = imageUrls.filter(url => url !== removedFile.url);
      setImageUrls(updatedImageUrls);
      form.setValue('images', updatedImageUrls, { shouldValidate: true });
      
      // CRITICAL: Also update the database with the updated URL list
      // This ensures that when a file is removed, the database is updated
      if (existingListing && existingListing.id) {
        updateListingMediaMutation.mutate({
          id: existingListing.id,
          mediaUrls: updatedImageUrls
        });
      }
    }
  };

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Make sure images is always an array
      const processedValues = {
        ...values,
        sellerId: user?.id,
        // Ensure images is a proper array, not undefined or null
        images: Array.isArray(values.images) ? values.images.filter(Boolean) : []
      };
      
      console.log('Submitting data:', JSON.stringify(processedValues));
      const res = await apiRequest("POST", "/api/pet-listings", processedValues);
      
      const result = await res.json();
      console.log('Server response:', result);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Listing created",
        description: "Your listing has been submitted for approval.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pet-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seller/pet-listings"] });
      setLocation("/seller/dashboard");
    },
    onError: (error: Error) => {
      console.error('Error in createListingMutation:', error);
      toast({
        title: "Error creating listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update listing mutation
  const updateListingMutation = useMutation({
    mutationFn: async (values: FormValues & { id: number }) => {
      const { id, ...updateData } = values;
      const res = await apiRequest("PUT", `/api/pet-listings/${id}`, updateData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Listing updated",
        description: "Your listing has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pet-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seller/pet-listings"] });
      setLocation("/seller/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    const filteredImages = imageUrls.filter((url) => url);
    const formData = {
      ...values,
      images: filteredImages,
    };

    if (isEdit && existingListing) {
      updateListingMutation.mutate({
        ...formData,
        id: existingListing.id,
      });
    } else {
      createListingMutation.mutate(formData);
    }
  };

  const isSubmitting = createListingMutation.isPending || updateListingMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Listing Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Adorable Golden Retriever Puppies" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="petType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Reset breed when pet type changes
                    form.setValue("breed", "");
                  }}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="fish">Fish</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the type of pet you are listing.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  {form.watch("petType") === "dog" ? (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a breed" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingBreeds ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Loading breeds...</span>
                          </div>
                        ) : (
                          <>
                            <SelectGroup>
                              <SelectLabel>Dog Breeds</SelectLabel>
                              {dogBreeds?.map((breed) => (
                                <SelectItem key={breed.id} value={breed.name}>
                                  {breed.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      placeholder={`e.g., ${
                        form.watch("petType") === "cat" ? "Persian" : 
                        form.watch("petType") === "bird" ? "Parrot" :
                        form.watch("petType") === "fish" ? "Goldfish" : "Breed"
                      }`} 
                      {...field} 
                    />
                  )}
                </FormControl>
                <FormDescription>
                  {form.watch("petType") === "dog" 
                    ? "Select from the standardized list of dog breeds." 
                    : "Enter the breed of your pet."}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mumbai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (in months)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 3"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 15000"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isVaccinated"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Vaccination Status</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Is the pet vaccinated?
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the pet, including temperament, training, and special characteristics."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-5">
          <div>
            <FormLabel>Pet Photos & Videos</FormLabel>
            <Card className="mt-2">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="pet-media-upload" 
                      className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 border-gray-600 h-32"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, MP4 or MOV (MAX. 10MB)
                        </p>
                        {isUploading && (
                          <div className="mt-2 flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-xs">Uploading...</span>
                          </div>
                        )}
                      </div>
                      <input 
                        id="pet-media-upload" 
                        type="file"
                        ref={fileInputRef}
                        accept="image/*, video/*"
                        multiple 
                        onChange={handleFileSelect}
                        className="hidden" 
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border">
                          {file.type === 'image' ? (
                            <img 
                              src={file.url} 
                              alt="Uploaded pet" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                              <video 
                                src={file.url}
                                controls
                                className="max-h-full max-w-full"
                                style={{ maxHeight: "100%", maxWidth: "100%" }}
                              >
                                Your browser does not support the video tag.
                              </video>
                              <Video className="h-6 w-6 text-primary mt-2" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeUploadedFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <FormLabel>Or Enter Image URLs</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageUrl}
              >
                Add Another URL
              </Button>
            </div>

            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter image URL"
                  value={url}
                  onChange={(e) => handleImageUrlChange(e.target.value, index)}
                />
                {imageUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeImageUrl(index)}
                  >
                    &times;
                  </Button>
                )}
              </div>
            ))}
            {form.formState.errors.images && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.images.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/seller/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Submitting..."}
              </>
            ) : (
              <>{isEdit ? "Update Listing" : "Create Listing"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ListingForm;
