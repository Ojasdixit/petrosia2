import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { PetListing } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet";
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical, 
  ClipboardList, 
  CheckCircle, 
  AlertCircle,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SellerDashboard = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<number | null>(null);

  // Get seller's listings
  const { data: listings, isLoading } = useQuery<PetListing[]>({
    queryKey: ["/api/seller/pet-listings"],
    enabled: !!user && user.role === "seller",
    select: (data) => {
      // Additional client-side filter to ensure we only get the current seller's listings
      if (!user) return [];
      return data.filter(listing => listing.sellerId === user.id);
    }
  });

  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/pet-listings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller/pet-listings"] });
      setDeleteDialogOpen(false);
    },
  });

  const handleDelete = (id: number) => {
    setListingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (listingToDelete) {
      deleteMutation.mutate(listingToDelete);
    }
  };

  // Separate listings by approval status
  const approvedListings = listings?.filter((listing) => listing.approved) || [];
  const pendingListings = listings?.filter((listing) => !listing.approved) || [];

  return (
    <>
      <Helmet>
        <title>Seller Dashboard - Petrosia</title>
        <meta name="description" content="Manage your pet listings on Petrosia" />
      </Helmet>

      <div className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
                Seller Dashboard
              </h1>
              <p className="text-neutral-600">
                Manage your pet listings and view inquiries
              </p>
            </div>
            <Button 
              onClick={() => setLocation("/seller/add-listing")}
              className="bg-primary hover:bg-primary-dark"
            >
              <Plus className="h-4 w-4 mr-2" /> Add New Listing
            </Button>
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
                    listings?.length || 0
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Listings</CardTitle>
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
                <CardTitle className="text-lg">Pending Approval</CardTitle>
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
                <ClipboardList className="h-4 w-4" /> All Listings ({listings?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex gap-2">
                <CheckCircle className="h-4 w-4" /> Active ({approvedListings.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex gap-2">
                <Clock className="h-4 w-4" /> Pending ({pendingListings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ListingsTable 
                listings={listings || []} 
                isLoading={isLoading} 
                onEdit={(id) => setLocation(`/seller/edit-listing/${id}`)}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="approved">
              <ListingsTable 
                listings={approvedListings} 
                isLoading={isLoading} 
                onEdit={(id) => setLocation(`/seller/edit-listing/${id}`)}
                onDelete={handleDelete}
                emptyMessage="You don't have any active listings yet."
              />
            </TabsContent>

            <TabsContent value="pending">
              <ListingsTable 
                listings={pendingListings} 
                isLoading={isLoading} 
                onEdit={(id) => setLocation(`/seller/edit-listing/${id}`)}
                onDelete={handleDelete}
                emptyMessage="You don't have any pending listings."
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
    </>
  );
};

type ListingsTableProps = {
  listings: PetListing[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  emptyMessage?: string;
};

const ListingsTable = ({ 
  listings, 
  isLoading, 
  onEdit, 
  onDelete,
  emptyMessage = "You don't have any listings yet."
}: ListingsTableProps) => {
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
          <p className="text-neutral-600 mb-4">{emptyMessage}</p>
          <Link href="/seller/add-listing">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add New Listing
            </Button>
          </Link>
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
            <th className="p-4 text-neutral-600 font-medium">Price</th>
            <th className="p-4 text-neutral-600 font-medium">Location</th>
            <th className="p-4 text-neutral-600 font-medium">Status</th>
            <th className="p-4 text-neutral-600 font-medium">Created</th>
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
                    <Link href={`/listings/${listing.id}`}>
                      <p className="font-medium text-neutral-900 hover:text-primary">
                        {listing.title}
                      </p>
                    </Link>
                    <p className="text-sm text-neutral-500">{listing.breed}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-neutral-700">₹{listing.price.toLocaleString()}</td>
              <td className="p-4 text-neutral-700">{listing.location}</td>
              <td className="p-4">
                <Badge 
                  variant={listing.approved ? "success" : "default"}
                  className={listing.approved 
                    ? "bg-green-100 text-green-800" 
                    : "bg-amber-100 text-amber-800"
                  }
                >
                  {listing.approved ? "Approved" : "Pending"}
                </Badge>
              </td>
              <td className="p-4 text-neutral-700">
                {new Date(listing.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(listing.id)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onDelete(listing.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerDashboard;
