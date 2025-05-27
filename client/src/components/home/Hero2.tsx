import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Check, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Keyframes for animations (unchanged)
const pulseRingKeyframes = `
@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.3;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
}
`;

const bounceKeyframes = `
@keyframes bounce-arrow {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}
`;

const attentionPulseKeyframes = `
@keyframes attention-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 153, 0, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 15px rgba(255, 153, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 153, 0, 0);
  }
}
`;

const glowKeyframes = `
@keyframes glow-effect {
  0% {
    filter: drop-shadow(0 0 5px rgba(255, 153, 0, 0.7));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 153, 0, 0.9));
  }
  100% {
    filter: drop-shadow(0 0 5px rgba(255, 153, 0, 0.7));
  }
}
`;

const ringKeyframes = `
@keyframes ring-bell {
  0%, 100% {
    transform: rotate(0);
  }
  20% {
    transform: rotate(15deg);
  }
  40% {
    transform: rotate(-15deg);
  }
  60% {
    transform: rotate(7deg);
  }
  80% {
    transform: rotate(-7deg);
  }
}
`;

// Add the keyframes to the document (unchanged)
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = pulseRingKeyframes + bounceKeyframes + attentionPulseKeyframes + glowKeyframes + ringKeyframes;
  document.head.appendChild(style);
}

// Hero carousel data (unchanged)
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
    image: "https://static2.tripoto.com/media/filter/nl/img/388225/TripDocument/1527606680_pool3.jpg",
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

import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react"; 

const EventRegistrationForm = ({ eventId, eventName, eventDate, eventLocation, onSuccess }) => (
  <form className="space-y-4" onSubmit={(e) => {
    e.preventDefault();
    onSuccess?.();
  }}>
    <div className="space-y-2">
      <label className="text-sm font-medium">Name</label>
      <input type="text" className="w-full p-2 border rounded" required />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium">Email</label>
      <input type="email" className="w-full p-2 border rounded" required />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium">Phone</label>
      <input type="tel" className="w-full p-2 border rounded" required />
    </div>
    <Button type="submit" className="w-full">Register Now</Button>
  </form>
);


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
            <div className="flex h-full p-3 md:p-6 relative z-10">
              <div className="flex flex-col justify-between flex-1">
                <div className="font-bold text-xl md:text-4xl mb-1 md:mb-3">{item.title}</div>
                <div>
                  <div className="flex items-center text-xs md:text-lg gap-1 md:gap-2 mb-1 md:mb-2">
                    <MapPin size={12} className="shrink-0 md:h-5 md:w-5" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center text-xs md:text-lg gap-1 md:gap-2">
                    <CalendarDays size={12} className="shrink-0 md:h-5 md:w-5" />
                    <span>{item.date}</span>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="secondary" className="text-sm mt-3 w-28 h-8 md:h-9 self-start">
                      REGISTER
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-0 overflow-y-auto max-h-[90vh]">
                    <div className="p-4 flex justify-between items-center border-b">
                      <h2 className="text-xl font-semibold">Event Registration</h2>
                      <DialogClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-4 w-4" />
                        </Button>
                      </DialogClose>
                    </div>
                    <div className="p-6">
                      <EventRegistrationForm 
                        eventId={1}
                        eventName={item.title}
                        eventDate={item.date}
                        eventLocation={item.location}
                        onSuccess={() => {}}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
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
              <div className="p-3 md:p-6 flex flex-col justify-between flex-1 z-10">
                <div className="text-xl md:text-4xl font-bold">
                  {item.name}
                </div>
                <div className="flex items-center gap-4 md:gap-8 mt-1 md:mt-3 text-xs md:text-lg">
                  <div>
                    <div className="uppercase opacity-80 md:text-sm">ORIGIN</div>
                    <div className="font-medium">{item.origin}</div>
                  </div>
                  <div>
                    <div className="uppercase opacity-80 md:text-sm">ENERGY</div>
                    <div className="font-medium">{item.energyLevel}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 md:gap-2 mt-1 md:mt-3">
                  {item.traits?.map((trait, idx) => (
                    <span key={idx} className="bg-white/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-base">
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
              <div className="p-3 md:p-6 flex flex-col justify-between flex-grow">
                <h2 className="text-xl md:text-4xl font-bold leading-tight">{item.title}</h2>
                <div className="grid grid-cols-2 gap-1 md:gap-4 mt-1 md:mt-4">
                  {item.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1 md:gap-2 text-xs md:text-lg">
                      <div className="bg-white rounded-full p-0.5 md:p-1 flex items-center justify-center">
                        <Check className="h-3 w-3 md:h-5 md:w-5 text-orange-500" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 md:gap-4 mt-1 md:mt-6">
                  <Button variant="secondary" className="text-xs md:text-base h-6 md:h-10 px-2 md:px-4">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 md:h-5 md:w-5 mr-1 md:mr-2"><path d="M12.954 11.616l2.957-2.957L6.36 3.291c-.633-.342-1.226-.39-1.746-.016l8.34 8.341zm3.461 3.462l3.074-1.729c.6-.336.929-.812.929-1.34 0-.527-.329-1.004-.928-1.34l-2.783-1.563-3.133 3.132 2.841 2.84zM4.1 4.002c-.064.197-.1.417-.1.658v14.705c0 .381.084.709.236.97l8.097-8.098L4.1 4.002zm8.854 8.855l-8.309 8.309c.495.184 1.052.126 1.637-.16l10.211-5.761-3.539-3.539v1.151z" fill="currentColor"></path></svg>
                    Google Play
                  </Button>
                  <Button variant="secondary" className="text-xs md:text-base h-6 md:h-10 px-2 md:px-4">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 md:h-5 md:w-5 mr-1 md:mr-2"><path d="M11.624 7.222c-.876 0-2.232-.996-3.66-.96-1.884.024-3.612 1.092-4.584 2.784-1.956 3.396-.504 8.412 1.404 11.172.936 1.344 2.04 2.856 3.504 2.808 1.404-.06 1.932-.912 3.636-.912 1.692 0 2.172.912 3.66.876 1.512-.024 2.472-1.368 3.396-2.724 1.068-1.56 1.512-3.072 1.536-3.156-.036-.012-2.94-1.128-2.976-4.488-.024-2.808 2.292-4.152 2.4-4.212-1.32-1.932-3.348-2.148-4.056-2.196-1.848-.144-3.396 1.008-4.26 1.008zm3.12-2.832c.78-.936 1.296-2.244 1.152-3.54-1.116.048-2.46.756-3.264 1.68-.72.828-1.344 2.16-1.176 3.432 1.236.096 2.508-.636 3.288-1.572z" fill="currentColor"></path></svg>
                    App Store
                  </Button>
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
          India's Ultimate Hub for Pet Lovers
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
                <div className="aspect-[7/4] relative max-h-[300px]">
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
        <div className="relative hidden md:block overflow-hidden max-w-[1200px] mx-auto">
          <div 
            className="flex flex-nowrap transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 80}%)` }}
          >
            {/* Duplicate first items at the end for infinite loop effect */}
            {[...heroItems, ...heroItems.slice(0, 2)].map((item, index) => (
              <div key={index} className="w-4/5 pr-4 flex-shrink-0">
                <div className="aspect-[7/4] relative max-h-[750px]">
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

      {/* Find your furry friend button - with enhanced attention-grabbing animations */}
      <div className="flex justify-center mt-4 mb-4">
        <div className="relative">
          {/* Multiple pulsing rings for attention */}
          <div className="absolute -inset-4 rounded-full bg-orange-500/10 animate-[attention-pulse_2s_ease-in-out_infinite]"></div>
          <div className="absolute -inset-2 rounded-full bg-orange-500/20 animate-[pulse-ring_2s_ease-in-out_infinite]"></div>
          <div className="absolute -inset-1 rounded-full bg-orange-500/30 animate-[pulse-ring_1.5s_ease-in-out_infinite_0.5s]"></div>

          {/* Main button with glow effect */}
          <Link href="/pets" className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 rounded-full text-white font-bold text-sm md:text-base 
            bg-gradient-to-r from-orange-500 to-amber-500 
            hover:from-orange-600 hover:to-amber-600
            transform hover:-translate-y-1 transition-all duration-200
            border border-white/20 relative overflow-hidden z-10
            before:absolute before:inset-0 before:bg-white/10 before:rounded-full
            animate-[glow-effect_3s_ease-in-out_infinite]
            shadow-[0_5px_20px_rgba(249,115,22,0.5)]">

            {/* Button content with bouncing arrow animation */}
            <span className="mr-2 text-yellow-100 animate-[ring-bell_2s_ease-in-out_infinite]">🔍</span>
            Find Your Furry Friend Now
            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 animate-[bounce-arrow_1s_ease-in-out_infinite]" />

            {/* Overlay effect */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent" 
              style={{transform: 'translateY(50%)'}}></span>
          </Link>

          {/* Notification ping for extra attention */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Hero;