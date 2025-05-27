import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const eventRegistrationSchema = z.object({
  eventId: z.number(),
  eventName: z.string().min(1, { message: "Event name is required" }),
  eventDate: z.string().min(1, { message: "Event date is required" }),
  eventLocation: z.string().min(1, { message: "Event location is required" }),
  name: z.string().min(1, { message: "Your name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  petName: z.string().optional(),
  petBreed: z.string().optional(),
  petAge: z.number().optional(),
  petType: z.enum(["dog", "cat", "bird", "fish", "other"]),
  specialRequirements: z.string().optional(),
});

type FormValues = z.infer<typeof eventRegistrationSchema>;

interface EventRegistrationFormProps {
  eventId: number;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  onSuccess?: () => void;
}

export default function EventRegistrationForm({ 
  eventId,
  eventName,
  eventDate,
  eventLocation,
  onSuccess 
}: EventRegistrationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      eventId,
      eventName,
      eventDate,
      eventLocation,
      name: "",
      email: "",
      phone: "",
      petName: "",
      petBreed: "",
      petType: "dog", // Default to "dog" instead of undefined
      specialRequirements: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      setIsSubmitting(true);
      const res = await apiRequest("POST", "/api/event-registrations", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration successful!",
        description: "You have successfully registered for this event.",
        variant: "default",
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: FormValues) => {
    if (data.petAge) {
      // Convert string to number if needed
      data.petAge = Number(data.petAge);
    }
    
    registerMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Event Registration</h2>
      
      <div className="mb-6 p-4 bg-muted/50 rounded-md">
        <h3 className="font-semibold text-lg">{eventName}</h3>
        <p className="text-sm text-muted-foreground">Date: {eventDate}</p>
        <p className="text-sm text-muted-foreground">Location: {eventLocation}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pet Information (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="petName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your pet's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="petBreed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet's Breed</FormLabel>
                    <FormControl>
                      <Input placeholder="Breed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="petAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet's Age (months)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Age in months" 
                        {...field} 
                        onChange={(e) => {
                          const value = e.target.value === "" ? undefined : parseInt(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="petType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
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
            </div>

            <FormField
              control={form.control}
              name="specialRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special requirements or questions?" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Let us know if you or your pet have any special requirements.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Register for Event"}
          </Button>
        </form>
      </Form>
    </div>
  );
}