import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Define the form schema
const bookingFormSchema = z.object({
  providerId: z.number(),
  petName: z.string().min(1, "Pet name is required"),
  petType: z.string().min(1, "Pet type is required"),
  petBreed: z.string().min(1, "Pet breed is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }).optional(),
  numberOfDays: z.number().optional(),
  numberOfVisits: z.number().optional(),
  specialInstructions: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  providerId: number;
  providerName: string;
  serviceType: string;
  pricePerDay?: number;
  pricePerVisit?: number;
  pricePerMonth?: number;
  isAC?: boolean;
  onSuccess?: (orderId: string) => void;
}

export function BookingForm({
  providerId,
  providerName,
  serviceType,
  pricePerDay,
  pricePerVisit,
  pricePerMonth,
  isAC = false,
  onSuccess,
}: BookingFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Calculate prices based on service type
  const calculatePrice = (values: BookingFormValues) => {
    switch (serviceType) {
      case "daycare":
      case "boarding":
        const days = values.numberOfDays || 1;
        return (pricePerDay || 0) * days;
      case "vet":
        return pricePerVisit || 0;
      case "walker":
        return pricePerMonth || 0;
      case "trainer":
        const visits = values.numberOfVisits || 1;
        return (pricePerVisit || 0) * visits;
      default:
        return 0;
    }
  };
  
  // Default values based on service type
  const getDefaultValues = () => {
    const defaultValues: Partial<BookingFormValues> = {
      providerId,
      petName: "",
      petType: "dog",
      petBreed: "",
      specialInstructions: "",
    };
    
    // Add default start date (today)
    const today = new Date();
    defaultValues.startDate = today;
    
    // For boarding, add default end date (tomorrow)
    if (serviceType === "boarding") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      defaultValues.endDate = tomorrow;
      defaultValues.numberOfDays = 1;
    }
    
    // For trainers, add default number of visits
    if (serviceType === "trainer") {
      defaultValues.numberOfVisits = 1;
    }
    
    return defaultValues;
  };
  
  // Form definition
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: getDefaultValues(),
  });
  
  // Watch form values for calculations
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const numberOfVisits = form.watch("numberOfVisits");
  
  // Calculate days between dates
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays || 1;
  };
  
  // Update number of days when dates change
  const days = calculateDays();
  if (days !== form.getValues("numberOfDays")) {
    form.setValue("numberOfDays", days);
  }
  
  // Create booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      // Calculate total amount
      const totalAmount = calculatePrice(data);
      
      // Create payment data
      const paymentData = {
        ...data,
        providerName,
        serviceType,
        amount: totalAmount,
        userId: user?.id,
        userEmail: user?.email,
        userPhone: user?.phone,
        userName: `${user?.firstName} ${user?.lastName}`,
      };
      
      const response = await apiRequest("POST", "/api/payments/create-order", paymentData);
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      
      if (data.paymentLink) {
        // Redirect to payment page
        window.location.href = data.paymentLink;
      } else if (data.orderId) {
        toast({
          title: "Booking successful!",
          description: "Your booking has been created successfully.",
        });
        
        if (onSuccess) {
          onSuccess(data.orderId);
        }
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message || "Failed to create your booking. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Form submission handler
  const onSubmit = (values: BookingFormValues) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to book a service.",
        variant: "destructive",
      });
      return;
    }
    
    bookingMutation.mutate(values);
  };
  
  const totalPrice = calculatePrice(form.getValues());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="petName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pet Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Buddy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="petType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Type</FormLabel>
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
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="petBreed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Labrador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsDatePickerOpen(false);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {(serviceType === "boarding") && (
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {days > 0 && (
                      <span>Duration: {days} day{days > 1 ? "s" : ""}</span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {serviceType === "trainer" && (
            <FormField
              control={form.control}
              name="numberOfVisits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Training Sessions</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="specialInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Instructions (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any special requirements or notes for your pet..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Service Type:</span>
            <span className="font-medium">
              {serviceType === "daycare" && "Pet Daycare"}
              {serviceType === "boarding" && "Pet Boarding"}
              {serviceType === "vet" && "Veterinary Care"}
              {serviceType === "walker" && "Dog Walking"}
              {serviceType === "trainer" && "Dog Training"}
            </span>
          </div>
          
          {/* Price display based on service type */}
          {(serviceType === "daycare" || serviceType === "boarding") && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Price per day:</span>
              <span>₹{pricePerDay} {isAC ? "(AC)" : "(Non-AC)"}</span>
            </div>
          )}
          
          {serviceType === "vet" && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Price per visit:</span>
              <span>₹{pricePerVisit}</span>
            </div>
          )}
          
          {serviceType === "walker" && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Monthly price:</span>
              <span>₹{pricePerMonth}</span>
            </div>
          )}
          
          {serviceType === "trainer" && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Price per session:</span>
              <span>₹{pricePerVisit}</span>
            </div>
          )}
          
          {/* Quantity display based on service type */}
          {(serviceType === "daycare" || serviceType === "boarding") && days > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Number of days:</span>
              <span>{days}</span>
            </div>
          )}
          
          {serviceType === "trainer" && numberOfVisits && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Number of sessions:</span>
              <span>{numberOfVisits}</span>
            </div>
          )}
          
          {/* Total amount */}
          <div className="flex justify-between items-center py-2 border-t border-b mt-2 mb-4">
            <span className="font-medium">Total Amount:</span>
            <span className="font-semibold text-lg">₹{totalPrice}</span>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={bookingMutation.isPending}
        >
          {bookingMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </Button>
      </form>
    </Form>
  );
}