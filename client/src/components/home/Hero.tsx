import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Check, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Hero carousel data - each item is one page in the slideshow
const heroItems = [
  {
    type: "event",
    title: "DELHI PUPPER PARTY",
    location: "DELHI, GURGAON",
    date: "28TH APRIL 2025",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#2E5D4B]"
  },
  {
    type: "breed",
    name: "HUSKY",
    image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    origin: "SIBERIA",
    energyLevel: "VERY HIGH",
    traits: ["FRIENDLY", "ATHLETIC", "MISCHIEVOUS"],
    bgColor: "bg-gradient-to-r from-orange-600 to-amber-500"
  },
  {
    type: "app-promo",
    title: "MANAGE YOUR DOG'S LIFE",
    features: ["NEARBY PARKS", "TRACK EXPENSES", "DAILY WALKS", "SAVE MEMORIES"],
    bgColor: "bg-gradient-to-r from-orange-500 to-orange-400",
    image: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "event",
    title: "MUMBAI PUPPER POOL PARTY",
    location: "THANE, MUMBAI",
    date: "13TH APRIL 2025",
    image: "https://images.unsplash.com/photo-1615241721407-cbda9277491c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    bgColor: "bg-[#1D4ED8]"
  },
  {
    type: "breed",
    name: "BOXER",
    image: "https://images.unsplash.com/photo-1543071220-6ee5bf71a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    origin: "GERMANY",
    energyLevel: "HIGH",
    traits: ["LOYAL", "PLAYFUL", "PROTECTIVE"],
    bgColor: "bg-gradient-to-r from-amber-600 to-amber-500"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const totalSlides = heroItems.length;

  // Auto rotate through slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  // When current slide changes, update the scroll position
  useEffect(() => {
    if (slideContainerRef.current) {
      slideContainerRef.current.scrollTo({
        left: 0,
        top: currentSlide * slideContainerRef.current.clientHeight,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  // Render appropriate content based on slide type
  const renderSlideContent = (item: typeof heroItems[0], index: number) => {
    switch (item.type) {
      case 'event':
        return (
          <div key={index} className={`${item.bgColor} rounded-lg overflow-hidden text-white relative h-full w-full shrink-0`}>
            <div className="flex h-full p-5 relative z-10">
              <div className="flex flex-col justify-between flex-1">
                <div className="font-bold text-2xl md:text-3xl mb-2">{item.title}</div>
                <div>
                  <div className="flex items-center text-sm gap-1 mb-2">
                    <MapPin size={14} className="shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center text-sm gap-1">
                    <CalendarDays size={14} className="shrink-0" />
                    <span>{item.date}</span>
                  </div>
                </div>
                <Link to="/events">
                  <Button size="sm" variant="secondary" className="text-sm mt-3 w-28 h-8 md:h-9 self-start">
                    REGISTER
                  </Button>
                </Link>
              </div>
            </div>
            <img 
              src={item.image}
              alt={item.title} 
              className="absolute opacity-30 h-full w-full object-cover top-0 left-0 z-0"
            />
          </div>
        );

      case 'breed':
        return (
          <div key={index} className={`${item.bgColor} rounded-lg overflow-hidden text-white relative h-full w-full shrink-0`}>
            <div className="flex h-full relative">
              <div className="p-5 flex flex-col justify-between flex-1 z-10">
                <div className="text-3xl md:text-4xl font-bold">
                  {item.name}
                </div>
                <div className="flex items-center gap-6 mt-2 text-sm">
                  <div>
                    <div className="uppercase opacity-80">ORIGIN</div>
                    <div className="font-medium">{item.origin}</div>
                  </div>
                  <div>
                    <div className="uppercase opacity-80">ENERGY</div>
                    <div className="font-medium">{item.energyLevel}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.traits?.map((trait, idx) => (
                    <span key={idx} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              {/* Dog image */}
              <div className="w-2/5 h-full relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="absolute h-full w-full object-cover"
                  style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
                />
              </div>
            </div>
          </div>
        );

      case 'app-promo':
        return (
          <div key={index} className={`${item.bgColor} rounded-lg overflow-hidden text-white relative h-full w-full shrink-0`}>
            <div className="flex h-full">
              <div className="p-5 flex flex-col justify-between flex-grow">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">{item.title}</h2>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {item.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="bg-white rounded-full p-0.5 flex items-center justify-center">
                        <Check className="h-4 w-4 text-orange-500" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 md:gap-4 mt-1 md:mt-6">
                  <a href="https://play.google.com/store/apps/details?id=com.petrosia.petrosia" target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="text-xs md:text-base h-6 md:h-10 px-2 md:px-4">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 md:h-5 md:w-5 mr-1 md:mr-2"><path d="M12.954 11.616l2.957-2.957L6.36 3.291c-.633-.342-1.226-.39-1.746-.016l8.34 8.341zm3.461 3.462l3.074-1.729c.6-.336.929-.812.929-1.34 0-.527-.329-1.004-.928-1.34l-2.783-1.563-3.133 3.132 2.841 2.84zM4.1 4.002c-.064.197-.1.417-.1.658v14.705c0 .381.084.709.236.97l8.097-8.098L4.1 4.002zm8.854 8.855l-8.309 8.309c.495.184 1.052.126 1.637-.16l10.211-5.761-3.539-3.539v1.151z" fill="currentColor"></path></svg>
                      Google Play
                    </Button>
                  </a>
                  <Link href="/coming-soon">
                    <Button variant="secondary" className="text-xs md:text-base h-6 md:h-10 px-2 md:px-4">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 md:h-5 md:w-5 mr-1 md:mr-2"><path d="M11.624 7.222c-.876 0-2.232-.996-3.66-.96-1.884.024-3.612 1.092-4.584 2.784-1.956 3.396-.504 8.412 1.404 11.172.936 1.344 2.04 2.856 3.504 2.808 1.404-.06 1.932-.912 3.636-.912 1.692 0 2.172.912 3.66.876 1.512-.024 2.472-1.368 3.396-2.724 1.068-1.56 1.512-3.072 1.536-3.156-.036-.012-2.94-1.128-2.976-4.488-.024-2.808 2.292-4.152 2.4-4.212-1.32-1.932-3.348-2.148-4.056-2.196-1.848-.144-3.396 1.008-4.26 1.008zm3.12-2.832c.78-.936 1.296-2.244 1.152-3.54-1.116.048-2.46.756-3.264 1.68-.72.828-1.344 2.16-1.176 3.432 1.236.096 2.508-.636 3.288-1.572z" fill="currentColor"></path></svg>
                      App Store
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-2/5 h-full relative">
                <img 
                  src={item.image}
                  alt="Dog app" 
                  className="absolute h-full w-full object-cover"
                  style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      {/* Main Heading */}
      <div className="text-center py-6">
        <h1 className="text-2xl md:text-4xl font-bold text-[#333]">
          India's Most Trusted Pet Marketplace
        </h1>
      </div>

      {/* Hero Banner Container */}
      <div className="container mx-auto px-3 relative">
        {/* Mobile view (full-width cards, one at a time) */}
        <div className="relative w-full overflow-hidden md:hidden">
          <div 
            className="flex flex-nowrap transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {heroItems.map((item, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="aspect-[5/4] relative">
                  {renderSlideContent(item, index)}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile navigation arrows */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full z-20"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full z-20"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Desktop view (show one card and part of the next) */}
        <div className="relative hidden md:block overflow-hidden">
          <div 
            className="flex flex-nowrap transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 80}%)` }}
          >
            {/* Duplicate first items at the end for infinite loop effect */}
            {[...heroItems, ...heroItems.slice(0, 2)].map((item, index) => (
              <div key={index} className="w-4/5 pr-4 flex-shrink-0">
                <div className="aspect-[5/4] relative">
                  {renderSlideContent(item, index)}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop navigation arrows */}
          <button 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
            onClick={() => {
              if (currentSlide === 0) {
                // Jump to the end duplicates without animation
                setTimeout(() => setCurrentSlide(totalSlides - 1), 10);
              } else {
                setCurrentSlide((prev) => prev - 1);
              }
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
            onClick={() => {
              if (currentSlide >= totalSlides - 1) {
                // Jump to the beginning duplicates without animation
                setTimeout(() => setCurrentSlide(0), 10);
              } else {
                setCurrentSlide((prev) => prev + 1);
              }
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center mt-4 mb-2 space-x-2">
          {heroItems.map((_, index) => (
            <button 
              key={index} 
              className={`h-2 w-2 rounded-full ${currentSlide === index ? 'bg-orange-500' : 'bg-gray-300'}`}
              onClick={() => {
                // If we're on desktop and at the end duplicates, go to the actual slides
                if (index < totalSlides) {
                  setCurrentSlide(index);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Find your furry friend button - with attention-grabbing animation */}
      <div className="flex justify-center mt-8 mb-4 relative z-10">
        <Link href="/listings" className="relative inline-flex items-center px-8 py-4 overflow-hidden font-medium transition-all bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 rounded-full hover:bg-orange-600 text-white text-lg shadow-xl hover:shadow-2xl animate-[attention-ring_2s_ease-in-out_infinite] active:animate-none before:absolute before:inset-0 before:rounded-full before:animate-[pulse-glow_2s_ease-in-out_infinite] before:content-[''] before:z-[-1]">
          <span className="mr-2">🔍</span>
          <span className="relative font-bold">Find your furry friend now</span>
          <svg className="ml-2 h-6 w-6 animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </Link>
        <div className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
        </div>
      </div>
    </div>
  );
};

export default Hero;