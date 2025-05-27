import { Calendar, MapPin, Clock, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import EventRegistrationForm from "@/components/events/EventRegistrationForm";

type EventCardProps = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  bgColor: string;
  description: string;
  city: string;
};

const EventCard = ({ id, title, date, time, location, image, category, bgColor, description, city }: EventCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group">
        <div className="relative overflow-hidden h-28 sm:h-32">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className={`absolute top-2 left-2 ${bgColor} text-white px-2 py-0.5 rounded-full text-xs font-medium`}>
            {category}
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-base font-bold mb-2 line-clamp-1 text-gray-800">{title}</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="text-xs truncate">{date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="text-xs truncate">{time}</span>
            </div>
            <div className="flex items-center text-gray-600 col-span-2">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="text-xs truncate">{location}</span>
            </div>
          </div>
          <div className="mt-3 text-right">
            <Button 
              variant="outline" 
              size="sm"
              className={`h-7 border-${bgColor.replace('bg-', '')} text-${bgColor.replace('bg-', '')} hover:bg-${bgColor.replace('bg-', '')}/10 text-xs px-2`}
              onClick={() => setIsOpen(true)}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
      
      {/* Event Details Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription className="text-sm">{city} - {date}</DialogDescription>
          </DialogHeader>
          
          <div className="relative h-48 rounded-md overflow-hidden my-2">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className={`${bgColor} text-white text-xs px-2 py-1 rounded-full`}>
                {category}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700">{description}</p>
            
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {date}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                {time}
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                <span>{location}</span>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={() => {
                setShowRegistrationForm(true);
                setIsOpen(false);
              }}>
                Register for Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Registration Form Dialog */}
      <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
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
              eventId={id}
              eventName={title}
              eventDate={date}
              eventLocation={location}
              onSuccess={() => setShowRegistrationForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Horizontal scrollable event card for mobile
const ScrollableEventCard = ({ id, title, date, time, location, image, category, bgColor, description, city }: EventCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  return (
    <>
      <div className={`flex-shrink-0 w-[85vw] sm:w-[280px] rounded-lg overflow-hidden ${bgColor} text-white shadow-sm relative h-36`}>
        <div 
          className="absolute inset-0 z-10 p-3 flex flex-col justify-between cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div>
            <span className="inline-block px-2 py-0.5 bg-white/20 text-white rounded-full text-xs">
              {category}
            </span>
            <h3 className="text-lg font-bold mt-1">{title}</h3>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-white/90 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{date}</span>
            </div>
            <div className="flex items-center text-white/90 text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{location}</span>
            </div>
            <Button 
              variant="secondary"
              size="sm"
              className="h-7 text-xs px-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setShowRegistrationForm(true);
              }}
            >
              Register Now
            </Button>
          </div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1]"></div>
        
        {/* Image */}
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover absolute inset-0"
        />
      </div>
      
      {/* Event Details Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription className="text-sm">{city} - {date}</DialogDescription>
          </DialogHeader>
          
          <div className="relative h-48 rounded-md overflow-hidden my-2">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className={`${bgColor} text-white text-xs px-2 py-1 rounded-full`}>
                {category}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700">{description}</p>
            
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {date}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                {time}
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                <span>{location}</span>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={() => {
                setShowRegistrationForm(true);
                setIsOpen(false);
              }}>
                Register for Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Registration Form Dialog */}
      <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
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
              eventId={id}
              eventName={title}
              eventDate={date}
              eventLocation={location}
              onSuccess={() => setShowRegistrationForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const PetEvents = () => {
  const events = [
    {
      id: 1,
      title: "Annual Delhi Dog Show",
      date: "April 28, 2025",
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
      date: "May 15, 2025",
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
      date: "June 5, 2025",
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
      date: "July 3, 2025",
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
      date: "July 25, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Central Community Hall, Chennai",
      image: "https://kindnesshospital.com/uploads/SiteAssets/0/images/news-global/pet-cancer-awareness-month-2024.jpg",
      category: "Health",
      bgColor: "bg-rose-500",
      city: "Chennai",
      description: "Free health checkups, vaccination drives, and expert consultations for all pets. Learn about preventive care."
    },
    {
      id: 6,
      title: "Pet Photography Day",
      date: "August 12, 2025",
      time: "11:00 AM - 7:00 PM",
      location: "Artsy Studios, Kolkata",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Photography",
      bgColor: "bg-purple-500",
      city: "Kolkata",
      description: "Professional photography sessions for your pets. Capture beautiful memories with your furry friends."
    }
  ];

  return (
    <section className="py-6 bg-white">
      <div className="container mx-auto px-3">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Pet Events Near You</h2>
            <p className="text-gray-600 text-sm mt-1">Join pet lovers community</p>
          </div>
          <Link href="/events" className="text-orange-500 text-sm flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* Mobile scrollable events */}
        <div className="md:hidden -mx-3 px-3 overflow-x-auto flex gap-3 pb-4 scrollbar-hide">
          {events.map((event, index) => (
            <ScrollableEventCard 
              key={index}
              id={event.id}
              title={event.title}
              date={event.date}
              time={event.time}
              location={event.location}
              image={event.image}
              category={event.category}
              bgColor={event.bgColor}
              city={event.city}
              description={event.description}
            />
          ))}
        </div>

        {/* Desktop grid events */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
        
        {/* India/USA location tabs for mobile */}
        <div className="flex mt-4 border-b border-gray-200 gap-4 overflow-x-auto pb-1 md:hidden">
          <button className="text-sm font-medium text-orange-500 border-b-2 border-orange-500 pb-1 px-1">
            India
          </button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-1 px-1">
            USA
          </button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-1 px-1">
            Singapore
          </button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-1 px-1">
            Australia
          </button>
        </div>
      </div>
    </section>
  );
};

export default PetEvents;