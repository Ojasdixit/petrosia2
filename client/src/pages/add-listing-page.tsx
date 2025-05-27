import { Helmet } from "react-helmet";
import ListingForm from "@/components/listing/ListingForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const AddListingPage = () => {
  const params = useParams<{ id: string }>();
  const isEditMode = Boolean(params?.id);
  const listingId = params?.id ? parseInt(params.id) : undefined;
  
  // Fetch listing data if in edit mode
  const { data: listing, isLoading } = useQuery({
    queryKey: ["/api/pet-listings", listingId],
    queryFn: () => 
      listingId ? 
        fetch(`/api/pet-listings/${listingId}`).then(res => res.json()) : 
        Promise.resolve(undefined),
    enabled: isEditMode
  });

  return (
    <>
      <Helmet>
        <title>{isEditMode ? "Edit Listing" : "Add New Listing"} - Petrosia</title>
        <meta name="description" content={isEditMode ? "Edit your pet listing on Petrosia" : "Create a new pet listing on Petrosia"} />
      </Helmet>

      <div className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 mb-8 text-center">
              {isEditMode ? "Edit Pet Listing" : "Create New Pet Listing"}
            </h1>

            <Card>
              <CardHeader>
                <CardTitle>{isEditMode ? "Edit Listing Details" : "Listing Details"}</CardTitle>
                <CardDescription>
                  {isEditMode 
                    ? "Update your pet listing information below."
                    : "Provide complete and accurate information about your pet. All listings will be reviewed by our team before being published."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditMode && isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <ListingForm 
                    existingListing={listing} 
                    isEdit={isEditMode} 
                  />
                )}
              </CardContent>
            </Card>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Listing Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li>• Provide accurate and detailed information about the pet</li>
                    <li>• Upload clear, high-quality images (3-5 photos recommended)</li>
                    <li>• Be honest about vaccination status and health conditions</li>
                    <li>• Set a fair price based on breed, age, and documentation</li>
                    <li>• Be responsive to inquiries from potential buyers</li>
                    <li>• Your listing will be reviewed by our team before being published</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddListingPage;
