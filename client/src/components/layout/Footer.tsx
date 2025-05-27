import { Link } from "wouter";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail, 
  Heart,
  ArrowRight,
  Clock,
  CalendarDays,
  PawPrint,
  Shield,
  Truck,
  HeartPulse
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-orange-50 to-amber-100 pt-16 pb-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-orange-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute top-1/3 right-0 w-24 h-24 bg-amber-300 rounded-full translate-x-1/2 opacity-30"></div>
      <div className="absolute bottom-0 left-1/3 w-16 h-16 bg-orange-300 rounded-full translate-y-1/2 opacity-40"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-500"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Join Our Pet Lovers Community</h3>
              <p className="text-gray-600 mb-0">Get exclusive updates on new arrivals, pet care tips, and special offers</p>
            </div>
            <div className="flex-1 w-full">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-orange-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.625 2.655c-1.44.146-2.521.73-3.2 1.614-.678.884-.854 1.977-.5 3.063.354 1.087 1.196 2.085 2.42 2.855a9.613 9.613 0 01-2.068 3.173 1 1 0 01-1.498-1.32 7.812 7.812 0 001.76-2.835C2.478 8.55 1.35 7.25.876 5.87-.06 3.4 1.67.832 5.187.07c1.32-.286 2.716-.218 4.01.176 1.293.395 2.42 1.072 3.19 1.993.77.922 1.114 2.075.936 3.24-.178 1.165-.872 2.223-1.905 2.998 2.67.49 4.608 3.01 4.608 5.716a1 1 0 11-2 0c0-1.51-.969-2.85-2.415-3.368-.41.323-.87.624-1.367.9.175.414.467.945.87 1.542.403.597.832 1.139 1.253 1.556.421.417.795.67 1.068.736.273.066.3-.008.207-.273a1 1 0 111.894.633c-.606 1.818-2.464 2.122-3.695 1.83-1.231-.293-2.308-1.148-3.137-2.158a9.5 9.5 0 01-1.007-1.556 11.76 11.76 0 01-.711-1.617 1.33 1.33 0 01-.012-.006 9.417 9.417 0 01-1.119.466 11.76 11.76 0 01-1.617.711c-.28.097-.575.173-.88.223.343.372.75.739 1.184 1.072.832.64 1.702 1.084 2.375 1.116.674.032.83-.369.5-1.003a1 1 0 111.802.867c-.83 1.726-2.465 2.153-3.876 2.04-1.41-.114-2.688-.776-3.752-1.597C.728 17.27 0 16.258 0 15a1 1 0 012 0c0 .05.048.186.193.362a4.79 4.79 0 00.675.627 5.97 5.97 0 002.993.841c.722.006 1.41-.18 1.92-.77a9.418 9.418 0 01-1.396-1.869c-.548-.973-.953-2.094-1.054-3.07-.101-.974.141-1.803.764-2.2.622-.398 1.531-.417 2.556-.085 1.024.332 2.099.997 3.01 1.776.335.286.64.582.911.883a6.223 6.223 0 01.794-.798 4.862 4.862 0 01.721-.56c-1.096-1.092-2.333-1.686-3.561-1.819-1.228-.132-2.414.193-3.248.853-.417.33-.742.76-.914 1.257-.172.497-.173 1.026.047 1.559.22.533.644 1.062 1.315 1.51a1 1 0 11-1.154 1.633c-.902-.638-1.56-1.419-1.93-2.311-.372-.892-.432-1.864-.113-2.77.319-.908.939-1.652 1.728-2.222 1.19-.858 2.792-1.308 4.45-1.137 1.658.17 3.307 1.004 4.635 2.37a1 1 0 01-.037 1.457c-.62.556-1.021 1.068-1.247 1.533a2.53 2.53 0 00-.218 1.493c.158.262.704.625 1.518.625.813 0 1.35-.363 1.509-.625a2.531 2.531 0 00-.218-1.493c-.226-.465-.626-.977-1.247-1.534a1 1 0 01-.037-1.456c1.327-1.367 2.977-2.2 4.635-2.37 1.658-.171 3.26.279 4.45 1.137.789.57 1.41 1.314 1.728 2.221.319.907.26 1.88-.113 2.771-.37.892-1.028 1.673-1.93 2.31a1 1 0 01-1.154-1.632c.671-.448 1.096-.977 1.315-1.51.22-.533.22-1.062.047-1.559-.172-.497-.497-.928-.914-1.257-.834-.66-2.02-.985-3.247-.853-1.229.133-2.466.727-3.562 1.82.253.155.492.333.72.558.347.346.65.75.793.8.295.052.619.061.934-.013.315-.074.66-.24 1.043-.532a1 1 0 111.237 1.574c-.597.469-1.246.77-1.93.913-.684.143-1.415.128-2.091-.082-.676-.21-1.285-.62-1.78-1.212a7.789 7.789 0 00-.6-.673 6.447 6.447 0 00-3.011-1.776c-1.025-.332-1.934-.313-2.556.085-.623.397-.865 1.226-.764 2.2.101.976.506 2.097 1.054 3.07a9.197 9.197 0 001.396 1.868c.51.59 1.198.776 1.92.77.722-.005 1.503-.306 2.206-.816a9.933 9.933 0 001.462-1.353c.047-.054.094-.109.14-.164 0 0-.047.109 0 0 .14.308.3.601.466.87a4.03 4.03 0 00.56.721c-.152-.151.05.038 0 0-1.093 1.096-1.687 2.333-1.82 3.561-.132 1.229.193 2.415.853 3.248.33.418.76.743 1.257.914.497.172 1.026.173 1.559-.047.533-.22 1.062-.644 1.51-1.315a1 1 0 011.633 1.154c-.638.902-1.419 1.56-2.311 1.93-.892.372-1.864.432-2.77.113-.908-.319-1.652-.939-2.222-1.728-.858-1.19-1.308-2.792-1.137-4.45.17-1.657 1.004-3.307 2.37-4.635a1 1 0 011.457.037c.556.62 1.068 1.021 1.533 1.247a2.53 2.53 0 001.493.218c.262-.158.625-.704.625-1.518s-.363-1.35-.625-1.509a2.531 2.531 0 00-1.493.218c-.465.226-.977.626-1.534 1.247a1 1 0 01-1.456.037c-1.367-1.327-2.2-2.977-2.37-4.635-.133-1.294.158-2.544.735-3.55"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-2xl font-bold text-gray-800">Petrosia</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              India's trusted platform connecting pet lovers with responsible breeders and adoption centers. We ensure safe and ethical pet transactions.
            </p>
            
            <div className="mb-6">
              <h5 className="font-medium text-gray-800 mb-3">Download Our App</h5>
              <div className="flex space-x-3">
                <Button variant="outline" className="text-xs h-10 border-gray-300 text-gray-700 gap-2" asChild>
                  <a href="https://play.google.com/store/apps/details?id=com.petrosia.petrosia&pli=1" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M12.954 11.616l2.957-2.957L6.36 3.291c-.633-.342-1.226-.39-1.746-.016l8.34 8.341zm3.461 3.462l3.074-1.729c.6-.336.929-.812.929-1.34 0-.527-.329-1.004-.928-1.34l-2.783-1.563-3.133 3.132 2.841 2.84zM4.1 4.002c-.064.197-.1.417-.1.658v14.705c0 .381.084.709.236.97l8.097-8.098L4.1 4.002zm8.854 8.855l-8.309 8.309c.495.184 1.052.126 1.637-.16l10.211-5.761-3.539-3.539v1.151z" fill="currentColor"></path></svg>
                    Google Play
                  </a>
                </Button>
                <Button variant="outline" className="text-xs h-10 border-gray-300 text-gray-700 gap-2">
                  <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M11.624 7.222c-.876 0-2.232-.996-3.66-.96-1.884.024-3.612 1.092-4.584 2.784-1.956 3.396-.504 8.412 1.404 11.172.936 1.344 2.04 2.856 3.504 2.808 1.404-.06 1.932-.912 3.636-.912 1.692 0 2.172.912 3.66.876 1.512-.024 2.472-1.368 3.396-2.724 1.068-1.56 1.512-3.072 1.536-3.156-.036-.012-2.94-1.128-2.976-4.488-.024-2.808 2.292-4.152 2.4-4.212-1.32-1.932-3.348-2.148-4.056-2.196-1.848-.144-3.396 1.008-4.26 1.008zm3.12-2.832c.78-.936 1.296-2.244 1.152-3.54-1.116.048-2.46.756-3.264 1.68-.72.828-1.344 2.16-1.176 3.432 1.236.096 2.508-.636 3.288-1.572z" fill="currentColor"></path></svg>
                  App Store
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <a href="#" className="bg-orange-100 hover:bg-orange-200 text-orange-600 p-2 rounded-full transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-orange-100 hover:bg-orange-200 text-orange-600 p-2 rounded-full transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-orange-100 hover:bg-orange-200 text-orange-600 p-2 rounded-full transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-orange-100 hover:bg-orange-200 text-orange-600 p-2 rounded-full transition-colors" aria-label="Youtube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Pet Services */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Pet Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services/walkers" className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2">
                  <PawPrint className="h-4 w-4 text-orange-400" />
                  Pet Walkers
                </Link>
              </li>
              <li>
                <Link href="/services/vets" className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-orange-400" />
                  Veterinary Care
                </Link>
              </li>
              <li>
                <Link href="/services/delivery" className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2">
                  <Truck className="h-4 w-4 text-orange-400" />
                  Pet Supplies
                </Link>
              </li>
              <li>
                <Link href="/services/trainers" className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-400" />
                  Pet Trainers
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-orange-500 hover:text-orange-600 transition-colors font-medium flex items-center gap-1 mt-1">
                  All Services <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Find Puppies
                </Link>
              </li>
              <li>
                <Link href="/adoption" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Adoption
                </Link>
              </li>
              <li>
                <Link href="/pet-care" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Pet Care Tips
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-600 hover:text-orange-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/seller/add-listing" className="text-gray-600 hover:text-orange-500 transition-colors">
                  List Your Pets
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="text-orange-500 mt-1 mr-3 shrink-0" size={18} />
                <span className="text-gray-600">
                  C29 1st floor bela bhawan nehru nagar adarsh nagar delhi, 110033
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="text-orange-500 mr-3 shrink-0" size={18} />
                <span className="text-gray-600">+91 9887805771</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-orange-500 mr-3 shrink-0" size={18} />
                <span className="text-gray-600">contact@petrosia.in</span>
              </li>
              <li className="flex items-center">
                <Clock className="text-orange-500 mr-3 shrink-0" size={18} />
                <span className="text-gray-600">Mon-Sat: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 py-6 mb-8 border-y border-gray-200">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-orange-500" />
            <span className="text-gray-700 font-medium">Verified Breeders</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-orange-500" />
            <span className="text-gray-700 font-medium">Healthy Pets Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-orange-500" />
            <span className="text-gray-700 font-medium">Vaccination Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-orange-500" />
            <span className="text-gray-700 font-medium">Veterinary Support</span>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Petrosia. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms-of-use" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund-policy" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">
              Refund & Cancellation
            </Link>
            <a href="/sitemap.html" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
