import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ListingsPage from "@/pages/listings-page";
import ListingDetailPage from "@/pages/listing-detail-page";
import SellerDashboard from "@/pages/seller-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AddListingPage from "@/pages/add-listing-page";
import PetsPage from "@/pages/pets-page";
import PetsDogsPage from "@/pages/pets-dogs-page";
import PetsCatsPage from "@/pages/pets/cats-page";
import PetsFishPage from "@/pages/pets/fish-page";
import PetsBirdsPage from "@/pages/pets/birds-page";
import ServicesPage from "@/pages/services-page";
import ServicesVetsPage from "@/pages/services-vets-page";
import ServicesWalkersPage from "@/pages/services-walkers-page";
import ServicesGroomingPage from "@/pages/services-grooming-page";
import ServicesDeliveryPage from "@/pages/services-delivery-page";
import ServicesPremiumFoodsPage from "@/pages/services-premium-foods-page";
import ServicesCheckupPage from "@/pages/services-checkup-page";
import ServicesDaycarePage from "@/pages/services-daycare-page";
import ServicesBoardingPage from "@/pages/services-boarding-page";
import ServiceProvidersPage from "@/pages/service-providers-page";
// Adoption pages removed from imports as requested
// import AdoptionPage from "@/pages/adoption-page";
// import AdoptionDetailPage from "@/pages/adoption-detail-page";
// import AdminAddAdoptionPage from "@/pages/admin-add-adoption-page";
import PetCarePage from "@/pages/pet-care-page";
import AboutUsPage from "@/pages/about-us-page";
import EventsPage from "@/pages/events-page";
import NewsPage from "@/pages/news-page";
import DogBreedsPage from "@/pages/dog-breeds-page";
import DogBreedDetailPage from "@/pages/dog-breed-detail-page";
import DogBreedsBySizePage from "@/pages/dog-breeds-by-size-page";
import DogBreedsComparePage from "@/pages/dog-breeds-compare-page";
import PrivacyPolicyPage from "@/pages/privacy-policy-page";
import TermsOfUsePage from "@/pages/terms-of-use-page";
import RefundPolicyPage from "@/pages/refund-policy-page";
import FranchisePage from "@/pages/franchise-page";
import VideoTesterPage from "./pages/video-tester-page";
import VideoTestPage from "./pages/video-test-page";
import BlogPage from "@/pages/blog-page";
import BlogNewPostPage from "@/pages/blog-new-post-page";
import BlogManagePage from "@/pages/blog-manage-page";
import BlogPendingPage from "@/pages/blog-pending-page";
import BlogDetailPage from "@/pages/blog-detail-page";
import PetBoardingPage from "@/pages/pet-boarding";
import PetBoardingGuidePage from "@/pages/blog/pet-boarding-guide";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import FacebookPixel from "./components/FacebookPixel";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/listings" component={ListingsPage} />
          <Route path="/listings/:id" component={ListingDetailPage} />
          <Route path="/pets" component={PetsPage} />
          <Route path="/pets/dogs" component={PetsDogsPage} />
          <Route path="/pets/cats" component={PetsCatsPage} />
          <Route path="/pets/fish" component={PetsFishPage} />
          <Route path="/pets/birds" component={PetsBirdsPage} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/services/vets" component={ServicesVetsPage} />
          <Route path="/services/walkers" component={ServicesWalkersPage} />
          <Route path="/services/grooming" component={ServicesGroomingPage} />
          <Route path="/services/delivery" component={ServicesDeliveryPage} />
          <Route path="/services/premium-foods" component={ServicesPremiumFoodsPage} />
          <Route path="/services/checkup" component={ServicesCheckupPage} />
          <Route path="/services/daycare" component={ServicesDaycarePage} />
          <Route path="/services/boarding" component={ServicesBoardingPage} />
          <Route path="/services/providers" component={ServiceProvidersPage} />
          <Route path="/services/providers/:type" component={ServiceProvidersPage} />
          {/* Adoption routes removed as requested */}
          {/* <Route path="/adoption" component={AdoptionPage} /> */}
          {/* <Route path="/adoption/:id" component={AdoptionDetailPage} /> */}
          <Route path="/pet-care" component={PetCarePage} />
          <Route path="/about-us" component={AboutUsPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/franchise" component={FranchisePage} />
          <Route path="/dog-breeds" component={DogBreedsPage} />
          <Route path="/dog-breeds/compare" component={DogBreedsComparePage} />
          <Route path="/dog-breeds/size/:size" component={DogBreedsBySizePage} />
          <Route path="/dog-breeds/:id" component={DogBreedDetailPage} />
          <Route path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route path="/terms-of-use" component={TermsOfUsePage} />
          <Route path="/refund-policy" component={RefundPolicyPage} />
          <Route path="/blog/new" component={BlogNewPostPage} />
          <Route path="/blog/edit/:id" component={BlogNewPostPage} />
          <Route path="/blog/manage" component={BlogManagePage} />
          <Route path="/blog/pending" component={BlogPendingPage} />
          <Route path="/blog/:slug" component={BlogDetailPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/pet-boarding" component={PetBoardingPage} />
          <Route path="/blog/pet-boarding-guide" component={PetBoardingGuidePage} />
          <ProtectedRoute path="/seller/dashboard" role="seller" component={SellerDashboard} />
          <ProtectedRoute path="/seller/add-listing" role="seller" component={AddListingPage} />
          <ProtectedRoute path="/seller/edit-listing/:id" role="seller" component={AddListingPage} />
          <ProtectedRoute path="/admin/dashboard" role="admin" component={AdminDashboard} />
          {/* Admin adoption management route removed as requested */}
          {/* <ProtectedRoute path="/admin/add-adoption" role="admin" component={AdminAddAdoptionPage} /> */}
          <Route path="/video-tester" component={VideoTesterPage} />
          <Route path="/video-test" component={VideoTestPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScrollToTop />
        <FacebookPixel />
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
