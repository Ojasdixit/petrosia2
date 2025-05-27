import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAdoptionListingSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";

import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

// Extend the schema with client-side validation
// Remove adminId requirement from the form validation schema
const formSchema = insertAdoptionListingSchema
  .omit({ adminId: true }) // Remove adminId requirement for form validation
  .extend({
    images: z.string().min(1, "Please enter at least one image URL").transform(str => {
      const urls = str.split(',').map(url => url.trim());
      return urls;
    })
  });

type FormValues = z.infer<typeof formSchema>;

interface AdoptionFormProps {
  existingListing?: any;
  isEdit?: boolean;
}

const AdoptionForm = ({ existingListing, isEdit = false }: AdoptionFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);

  // Parse existing images array back to comma-separated string for edit mode
  const defaultValues: Partial<FormValues> = {
    name: existingListing?.name || "",
    breed: existingListing?.breed || "",
    petType: existingListing?.petType || "dog",
    age: existingListing?.age || 0,
    gender: existingListing?.gender || "male",
    location: existingListing?.location || "",
    description: existingListing?.description || "",
    isVaccinated: existingListing?.isVaccinated || false,
    isNeutered: existingListing?.isNeutered || false,
    specialNeeds: existingListing?.specialNeeds || "",
    temperament: existingListing?.temperament || "",
    images: existingListing?.images ? existingListing.images.join(", ") : "",
    contactEmail: existingListing?.contactEmail || (user?.email ? user.email : ""),
    contactPhone: existingListing?.contactPhone || "",
    applicationLink: existingListing?.applicationLink || "",
    status: existingListing?.status || "available",
  };

  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Create mutation for adding a new adoption listing
  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log("Sending API request to /api/adoption-listings");
      if (!user?.id) {
        throw new Error("User ID not found. You must be logged in as an admin to add adoption listings.");
      }
      
      // Make sure we include the adminId in the request
      const dataToSubmit = {
        ...values,
        adminId: user.id
      };
      console.log("Data being sent to API:", dataToSubmit);
      
      // apiRequest already includes credentials by default
      const res = await apiRequest("POST", "/api/adoption-listings", dataToSubmit);
      
      if (!res.ok) {
        // Try to get error text first to log it
        const errorText = await res.text();
        console.error("API error response status:", res.status, res.statusText);
        console.error("API error response body:", errorText);
        
        // Try to parse as JSON if possible
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `Server returned ${res.status}: ${res.statusText}`);
        } catch (e) {
          // If parsing fails, use the raw text
          throw new Error(`Server error (${res.status}): ${errorText || res.statusText}`);
        }
      }
      
      console.log("API response received:", res.status);
      const data = await res.json();
      console.log("API response data:", data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Pet added for adoption successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/adoption-listings"] });
      navigate("/admin/dashboard");
    },
    onError: (error: any) => {
      console.error("Adoption form submission error:", error);
      
      // Try to extract more detailed error information
      let errorDetail = "Unknown error";
      if (error.message) {
        errorDetail = error.message;
      }
      
      // Check if there's a response with error details
      if (error.response) {
        try {
          console.log("Error response:", error.response);
          if (typeof error.response.json === 'function') {
            error.response.json().then((data: any) => {
              console.log("Error response data:", data);
            }).catch((e: any) => {
              console.log("Failed to parse error response:", e);
            });
          }
        } catch (e) {
          console.log("Failed to log error response:", e);
        }
      }
      
      toast({
        title: "Failed to add pet for adoption",
        description: `Error: ${errorDetail}. Please check console for details.`,
        variant: "destructive",
      });
    },
  });

  // Create mutation for updating an existing adoption listing
  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log("Sending update API request to /api/adoption-listings/" + existingListing.id);
      try {
        // Make sure we include the adminId in the request
        const dataToSubmit = {
          ...values,
          adminId: existingListing.adminId || user?.id
        };
        console.log("Update data being sent to API:", dataToSubmit);
        
        // apiRequest already includes credentials by default
        const res = await apiRequest("PUT", `/api/adoption-listings/${existingListing.id}`, dataToSubmit);
        
        if (!res.ok) {
          // Try to get error text first to log it
          const errorText = await res.text();
          console.error("API update error response status:", res.status, res.statusText);
          console.error("API update error response body:", errorText);
          
          // Try to parse as JSON if possible
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.message || `Server returned ${res.status}: ${res.statusText}`);
          } catch (e) {
            // If parsing fails, use the raw text
            throw new Error(`Server error (${res.status}): ${errorText || res.statusText}`);
          }
        }
        
        console.log("API update response received:", res.status);
        const data = await res.json();
        console.log("API update response data:", data);
        return data;
      } catch (error) {
        console.error("API update request failed:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Adoption listing updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/adoption-listings"] });
      navigate("/admin/dashboard");
    },
    onError: (error: Error) => {
      console.error("Adoption form update error:", error);
      toast({
        title: "Failed to update adoption listing",
        description: `Error: ${error.message}. Please check console for details.`,
        variant: "destructive",
      });
    },
  });

  // Manual submit handler (outside form validation)
  const handleManualSubmit = async () => {
    console.log("Manual submit button clicked - bypassing form validation");
    const values = form.getValues();
    console.log("Form values for manual submission:", values);
    
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in as an admin to add adoption listings.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create submission data with adminId included
      const dataToSubmit = {
        ...values,
        adminId: user.id,
        status: isEdit ? values.status : "available"
      };
      
      console.log("Manual submit data being sent to API:", dataToSubmit);
      
      // Direct API request using fetch
      const response = await fetch(isEdit ? 
        `/api/adoption-listings/${existingListing?.id}` : 
        '/api/adoption-listings', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
        credentials: 'include'
      });
      
      console.log("Manual API Response status:", response.status);
      
      // Handle errors
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          const errorText = await response.text();
          console.error("Manual submit error response text:", errorText);
        }
        throw new Error(errorMessage);
      }
      
      // Success
      const result = await response.json();
      console.log("Manual submit API success response:", result);
      
      toast({
        title: "Success!",
        description: isEdit ? "Adoption listing updated successfully." : "Pet added for adoption successfully.",
      });
      
      // Invalidate queries and navigate
      queryClient.invalidateQueries({ queryKey: ["/api/adoption-listings"] });
      
      // Use window.location for more reliable navigation
      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error("Manual form submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting the form. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Regular form submission handler
  const onSubmit = async (values: FormValues) => {
    console.log("Form values being submitted:", values);
    console.log("Current user:", user);
    console.log("Form state:", form.formState);
    
    // Don't proceed if form is invalid
    if (!form.formState.isValid) {
      console.error("Form validation failed:", form.formState.errors);
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Ensure admin ID is included
      if (!user?.id) {
        console.error("No user ID found - user may not be authenticated or may not be an admin");
        toast({
          title: "Authentication Error", 
          description: "You must be logged in as an admin to submit this form. Please log in and try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Add adminId and default status to values
      const dataToSubmit = {
        ...values,
        adminId: user.id,
        status: isEdit ? values.status : "available"
      };
      
      console.log("Form data being sent to API:", dataToSubmit);
      
      // Make a direct fetch request
      const response = await fetch(isEdit ? 
        `/api/adoption-listings/${existingListing?.id}` : 
        '/api/adoption-listings', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
        credentials: 'include'
      });
      
      console.log("API Response status:", response.status);
      
      // Handle error responses
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          // If we can't parse JSON, use the status text
          const errorText = await response.text();
          console.error("Error response text:", errorText);
        }
        throw new Error(errorMessage);
      }
      
      // Success
      const result = await response.json();
      console.log("API success response:", result);
      
      toast({
        title: "Success!",
        description: isEdit ? "Adoption listing updated successfully." : "Pet added for adoption successfully.",
      });
      
      // Invalidate queries and navigate
      queryClient.invalidateQueries({ queryKey: ["/api/adoption-listings"] });
      
      // Use window.location for more reliable navigation
      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting the form. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Adoption Listing" : "Add a Pet for Adoption"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter pet name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Breed */}
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed*</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. Labrador Retriever" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pet Type */}
            <FormField
              control={form.control}
              name="petType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Type*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pet type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="fish">Fish</SelectItem>
                      <SelectItem value="small_pet">Small Pet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age (in months)*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Enter age in months"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the age in months (e.g. 24 for 2 years)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location*</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Area" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Vaccinated */}
            <FormField
              control={form.control}
              name="isVaccinated"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Vaccinated</FormLabel>
                    <FormDescription>
                      Has the pet received vaccinations?
                    </FormDescription>
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

            {/* Is Neutered */}
            <FormField
              control={form.control}
              name="isNeutered"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Neutered/Spayed</FormLabel>
                    <FormDescription>
                      Has the pet been neutered or spayed?
                    </FormDescription>
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
          </div>

          {/* Temperament */}
          <FormField
            control={form.control}
            name="temperament"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperament*</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. Friendly, Energetic, Calm" {...field} />
                </FormControl>
                <FormDescription>
                  Describe the pet's personality traits
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Special Needs */}
          <FormField
            control={form.control}
            name="specialNeeds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Needs</FormLabel>
                <FormControl>
                  <Input placeholder="Any special care requirements?" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  Mention any medical conditions or special care needs
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed description of the pet"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include details about the pet's history, behavior, and why they need a new home
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter image URLs separated by commas"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide URLs of images, separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Email */}
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email*</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email for adoption inquiries"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Phone */}
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone number for adoption inquiries"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Application Link */}
          <FormField
            control={form.control}
            name="applicationLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Link</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="URL to adoption application form (optional)" 
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Optional link to an external application form
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status - only for edit mode */}
          {isEdit && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adoption Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="adopted">Adopted</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Normal form submit button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || createMutation.isPending || updateMutation.isPending}
          >
            {(loading || createMutation.isPending || updateMutation.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>{isEdit ? "Update Adoption Listing" : "Add Pet for Adoption"}</>
            )}
          </Button>
        </form>
      </Form>
      
      {/* Manual submit button outside the form */}
      <div className="mt-6">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={async () => {
            console.log("Direct submit button clicked");
            // Get current values from the form
            const values = form.getValues();
            
            if (!user?.id) {
              toast({
                title: "Authentication Error",
                description: "You must be logged in as an admin to add adoption listings.",
                variant: "destructive",
              });
              return;
            }
            
            setLoading(true);
            
            try {
              // Add adminId directly to the data
              const dataToSubmit = {
                ...values,
                adminId: user.id,
                status: isEdit ? values.status : "available"
              };
              
              console.log("Direct submit data:", dataToSubmit);
              
              // Use fetch API directly
              const response = await fetch(isEdit ? 
                `/api/adoption-listings/${existingListing?.id}` : 
                '/api/adoption-listings', {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
                credentials: 'include'
              });
              
              console.log("Direct submit response:", response.status);
              
              if (!response.ok) {
                throw new Error(`Failed to submit: ${response.status} ${response.statusText}`);
              }
              
              toast({
                title: "Success!",
                description: isEdit ? "Adoption listing updated successfully." : "Pet added for adoption successfully.",
              });
              
              // Navigate away
              window.location.href = "/admin/dashboard";
            } catch (error) {
              console.error("Direct submit error:", error);
              toast({
                title: "Submission Failed",
                description: error instanceof Error ? error.message : "Failed to submit form",
                variant: "destructive",
              });
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <strong>Click here to {isEdit ? "Update" : "Add"} (Manual Submit)</strong>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdoptionForm;