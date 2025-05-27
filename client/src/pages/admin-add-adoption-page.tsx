import { useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import AdoptionForm from "@/components/adoption/AdoptionForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function AdminAddAdoptionPage() {
  const { user, isLoading } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if not an admin
  useEffect(() => {
    if (!isLoading && user && user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
    
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If the user is not an admin, don't render the form
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Add Pet for Adoption | Petrosia Admin</title>
        <meta
          name="description"
          content="Admin page to add a pet for adoption on Petrosia."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/dashboard">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <AdoptionForm />
        </div>
      </div>
    </>
  );
}