import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export type UserRole = "buyer" | "seller" | "admin";
export type AdoptionStatus = "available" | "pending" | "adopted";
export type NewsSource = "petsworld" | "dogexpress" | "oliverpetcare" | "other";
export type DogSize = "small" | "medium" | "large" | "giant";
export type DogCoat = "short" | "medium" | "long" | "wire" | "curly" | "double" | "hairless";
export type DogTemperament = "friendly" | "aggressive" | "protective" | "loyal" | "independent" | "playful" | "alert" | "intelligent" | "trainable" | "stubborn" | "calm" | "energetic";
export type ReviewCategory = "quality" | "communication" | "value" | "expertise" | "responsiveness";
export type PetSpecies = "dog" | "cat" | "bird" | "fish" | "other";
export type RegistrationStatus = "pending" | "approved" | "rejected" | "attended";
export type MediaResourceType = "image" | "video";
export type MediaEntityType = "pet" | "breed" | "provider" | "event" | "general";
export type ServiceType = "daycare" | "boarding" | "vet" | "walker" | "trainer";
export type ServiceOption = "ac" | "non-ac" | "once-daily" | "twice-daily";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

// Enum values for use in code
export const PaymentStatus = {
  PENDING: "pending" as const,
  PROCESSING: "processing" as const,
  COMPLETED: "completed" as const,
  FAILED: "failed" as const,
  REFUNDED: "refunded" as const,
};

export const BookingStatus = {
  PENDING: "pending" as const,
  CONFIRMED: "confirmed" as const,
  CANCELLED: "cancelled" as const,
  COMPLETED: "completed" as const,
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  role: text("role").notNull().$type<UserRole>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  listings: many(petListings),
  adoptionListings: many(adoptionListings),
  reviewsGiven: many(sellerReviews, { relationName: "reviewer" }),
  reviewsReceived: many(sellerReviews, { relationName: "seller" }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
});

export const petListings = pgTable("pet_listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  breed: text("breed").notNull(),
  petType: text("pet_type").notNull().$type<PetSpecies>().default("dog"),
  age: integer("age").notNull(), // Age in months
  location: text("location").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  isVaccinated: boolean("is_vaccinated").notNull(),
  images: jsonb("images").notNull().$type<string[]>(),
  sellerId: integer("seller_id").notNull(),
  approved: boolean("approved").default(false),
  wishlistCount: integer("wishlist_count").default(0),
  enquiryCount: integer("enquiry_count").default(0),
  isHighlyEnquired: boolean("is_highly_enquired").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const petListingsRelations = relations(petListings, ({ one }) => ({
  seller: one(users, {
    fields: [petListings.sellerId],
    references: [users.id],
  }),
}));

export const insertPetListingSchema = createInsertSchema(petListings).pick({
  title: true,
  breed: true,
  petType: true,
  age: true,
  location: true,
  price: true,
  description: true,
  isVaccinated: true,
  images: true,
  sellerId: true,
  approved: true,
  wishlistCount: true,
  enquiryCount: true,
  isHighlyEnquired: true,
});

export const adoptionListings = pgTable("adoption_listings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  breed: text("breed").notNull(),
  petType: text("pet_type").notNull().$type<PetSpecies>().default("dog"),
  age: integer("age").notNull(), // Age in months
  gender: text("gender").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  isVaccinated: boolean("is_vaccinated").notNull(),
  isNeutered: boolean("is_neutered").notNull(),
  specialNeeds: text("special_needs"),
  temperament: text("temperament").notNull(),
  images: jsonb("images").notNull().$type<string[]>(),
  adminId: integer("admin_id").notNull(),
  status: text("status").notNull().$type<AdoptionStatus>().default("available"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  applicationLink: text("application_link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adoptionListingsRelations = relations(adoptionListings, ({ one }) => ({
  admin: one(users, {
    fields: [adoptionListings.adminId],
    references: [users.id],
  }),
}));

export const insertAdoptionListingSchema = createInsertSchema(adoptionListings).pick({
  name: true,
  breed: true,
  petType: true,
  age: true,
  gender: true,
  location: true,
  description: true,
  isVaccinated: true,
  isNeutered: true,
  specialNeeds: true,
  temperament: true,
  images: true,
  adminId: true,
  status: true,
  contactEmail: true,
  contactPhone: true,
  applicationLink: true,
});

export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  source: text("source").notNull().$type<NewsSource>(),
  sourceUrl: text("source_url").notNull(),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  categories: jsonb("categories").$type<string[]>().default([]),
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).pick({
  title: true,
  content: true,
  summary: true,
  source: true,
  sourceUrl: true,
  imageUrl: true,
  publishedAt: true,
  categories: true,
});

export const sellerReviews = pgTable("seller_reviews", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  reviewerId: integer("reviewer_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 scale
  comment: text("comment").notNull(),
  response: text("response"),
  categoriesRatings: jsonb("categories_ratings").$type<Record<ReviewCategory, number>>(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sellerReviewsRelations = relations(sellerReviews, ({ one }) => ({
  seller: one(users, {
    fields: [sellerReviews.sellerId],
    references: [users.id],
    relationName: "seller",
  }),
  reviewer: one(users, {
    fields: [sellerReviews.reviewerId],
    references: [users.id],
    relationName: "reviewer",
  }),
}));

export const insertSellerReviewSchema = createInsertSchema(sellerReviews).pick({
  sellerId: true,
  reviewerId: true,
  rating: true,
  comment: true,
  categoriesRatings: true,
  verified: true,
});

export const dogBreeds = pgTable("dog_breeds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  origin: text("origin").notNull(),
  group: text("group").notNull(), // e.g., "Working", "Sporting", "Toy", "Terrier"
  size: text("size").notNull().$type<DogSize>(),
  maleHeight: text("male_height").notNull(), // in inches, range format like "22-26"
  femaleHeight: text("female_height").notNull(), // in inches
  maleWeight: text("male_weight").notNull(), // in kg, range format like "29-36"
  femaleWeight: text("female_weight").notNull(), // in kg
  lifeExpectancy: text("life_expectancy").notNull(), // in years, range format like "10-12"
  coat: text("coat").notNull().$type<DogCoat>(),
  coatColors: jsonb("coat_colors").notNull().$type<string[]>(),
  temperament: jsonb("temperament").notNull().$type<DogTemperament[]>(),
  energyLevel: integer("energy_level").notNull(), // 1-5 scale
  exerciseNeeds: integer("exercise_needs").notNull(), // 1-5 scale
  trainability: integer("trainability").notNull(), // 1-5 scale
  goodWithChildren: integer("good_with_children").notNull(), // 1-5 scale
  goodWithOtherDogs: integer("good_with_other_dogs").notNull(), // 1-5 scale
  goodWithStrangers: integer("good_with_strangers").notNull(), // 1-5 scale
  sheddingAmount: integer("shedding_amount").notNull(), // 1-5 scale
  droolingAmount: integer("drooling_amount").notNull(), // 1-5 scale
  groomingNeeds: integer("grooming_needs").notNull(), // 1-5 scale
  barkingAmount: integer("barking_amount").notNull(), // 1-5 scale
  healthIssues: jsonb("health_issues").notNull().$type<string[]>(),
  description: text("description").notNull(),
  history: text("history").notNull(),
  variants: jsonb("variants").$type<string[]>().default([]),
  specialConsiderations: text("special_considerations"),
  funFacts: jsonb("fun_facts").$type<string[]>().default([]),
  popularity: integer("popularity").notNull(), // Rank in India
  mainImage: text("main_image").notNull(),
  galleryImages: jsonb("gallery_images").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDogBreedSchema = createInsertSchema(dogBreeds).pick({
  name: true,
  origin: true,
  group: true,
  size: true,
  maleHeight: true,
  femaleHeight: true,
  maleWeight: true,
  femaleWeight: true,
  lifeExpectancy: true,
  coat: true,
  coatColors: true,
  temperament: true,
  energyLevel: true,
  exerciseNeeds: true,
  trainability: true,
  goodWithChildren: true,
  goodWithOtherDogs: true,
  goodWithStrangers: true,
  sheddingAmount: true,
  droolingAmount: true,
  groomingNeeds: true,
  barkingAmount: true,
  healthIssues: true,
  description: true,
  history: true,
  variants: true,
  specialConsiderations: true,
  funFacts: true,
  popularity: true,
  mainImage: true,
  galleryImages: true,
});

// Event Registration table
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(), // For future usage when we have separate events table
  eventName: text("event_name").notNull(),
  eventDate: text("event_date").notNull(),
  eventLocation: text("event_location").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  petName: text("pet_name"),
  petBreed: text("pet_breed"),
  petAge: integer("pet_age"),
  petType: text("pet_type").$type<PetSpecies>(),
  specialRequirements: text("special_requirements"),
  userId: integer("user_id"), // If user is logged in
  status: text("status").$type<RegistrationStatus>().default("pending"),
  notes: text("notes"), // Admin notes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  user: one(users, {
    fields: [eventRegistrations.userId],
    references: [users.id],
    relationName: "eventRegistrant"
  }),
}));

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).pick({
  eventId: true,
  eventName: true,
  eventDate: true,
  eventLocation: true,
  name: true,
  email: true,
  phone: true,
  petName: true,
  petBreed: true,
  petAge: true,
  petType: true,
  specialRequirements: true,
  userId: true,
  status: true,
  notes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPetListing = z.infer<typeof insertPetListingSchema>;
export type PetListing = typeof petListings.$inferSelect;
export type InsertAdoptionListing = z.infer<typeof insertAdoptionListingSchema>;
export type AdoptionListing = typeof adoptionListings.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertSellerReview = z.infer<typeof insertSellerReviewSchema>;
export type SellerReview = typeof sellerReviews.$inferSelect;
export type InsertDogBreed = z.infer<typeof insertDogBreedSchema>;
export type DogBreed = typeof dogBreeds.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;

// Media files (images and videos) table
export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  publicId: text("public_id").notNull().unique(), // Cloudinary public ID
  originalFilename: text("original_filename"),
  url: text("url").notNull(),
  secureUrl: text("secure_url").notNull(),
  resourceType: text("resource_type").notNull().$type<MediaResourceType>(),
  format: text("format").notNull(), // File extension (jpg, png, mp4, etc.)
  width: integer("width"),
  height: integer("height"),
  bytes: integer("bytes").notNull(),
  duration: numeric("duration"), // For videos only (in seconds)
  entityType: text("entity_type").notNull().$type<MediaEntityType>(),
  entityId: integer("entity_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMediaFileSchema = createInsertSchema(mediaFiles).pick({
  publicId: true,
  originalFilename: true,
  url: true,
  secureUrl: true,
  resourceType: true,
  format: true,
  width: true,
  height: true,
  bytes: true,
  duration: true,
  entityType: true,
  entityId: true,
});

export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;
export type MediaFile = typeof mediaFiles.$inferSelect;

// Service providers table 
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  serviceType: text("service_type").notNull().$type<ServiceType>(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  rating: numeric("rating").default("0"),
  reviewCount: integer("review_count").default(0),
  availableOptions: jsonb("available_options").$type<ServiceOption[]>().default([]),
  pricePerDay: integer("price_per_day"), // For daycare/boarding
  pricePerVisit: integer("price_per_visit"), // For vet/trainer
  pricePerMonth: integer("price_per_month"), // For walkers
  isAC: boolean("is_ac"), // For daycare/boarding
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertServiceProviderSchema = createInsertSchema(serviceProviders).pick({
  name: true,
  serviceType: true,
  location: true,
  address: true,
  phone: true,
  email: true,
  description: true,
  imageUrl: true,
  rating: true,
  reviewCount: true,
  availableOptions: true,
  pricePerDay: true,
  pricePerVisit: true,
  pricePerMonth: true,
  isAC: true,
  isVerified: true,
  isActive: true,
});

// Service bookings table
export const serviceBookings = pgTable("service_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  providerId: integer("provider_id").notNull().references(() => serviceProviders.id),
  serviceType: text("service_type").notNull().$type<ServiceType>(),
  serviceOption: text("service_option").$type<ServiceOption>(),
  petName: text("pet_name").notNull(),
  petBreed: text("pet_breed").notNull(),
  petAge: integer("pet_age").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"), // For daycare/boarding
  totalAmount: integer("total_amount").notNull(), // In INR (₹)
  status: text("status").notNull().$type<BookingStatus>().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceBookingsRelations = relations(serviceBookings, ({ one }) => ({
  user: one(users, {
    fields: [serviceBookings.userId],
    references: [users.id],
  }),
  provider: one(serviceProviders, {
    fields: [serviceBookings.providerId],
    references: [serviceProviders.id],
  }),
}));

export const insertServiceBookingSchema = createInsertSchema(serviceBookings).pick({
  userId: true,
  providerId: true,
  serviceType: true,
  serviceOption: true,
  petName: true,
  petBreed: true,
  petAge: true,
  startDate: true,
  endDate: true,
  totalAmount: true,
  status: true,
  notes: true,
});

// Payments table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().unique().references(() => serviceBookings.id),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(), // In INR (₹)
  currency: text("currency").default("INR").notNull(),
  paymentMethod: text("payment_method").notNull(),
  orderId: text("order_id").notNull().unique(), // Cashfree order ID
  referenceId: text("reference_id"), // Cashfree reference ID
  status: text("status").notNull().$type<PaymentStatus>().default("pending"),
  paymentLink: text("payment_link"), // Payment gateway link
  metadata: jsonb("metadata"), // Additional payment data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(serviceBookings, {
    fields: [payments.bookingId],
    references: [serviceBookings.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const insertPaymentSchema = createInsertSchema(payments).pick({
  bookingId: true,
  userId: true,
  amount: true,
  currency: true,
  paymentMethod: true,
  orderId: true,
  referenceId: true,
  status: true,
  paymentLink: true,
  metadata: true,
});

export type InsertServiceProvider = z.infer<typeof insertServiceProviderSchema>;
export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type InsertServiceBooking = z.infer<typeof insertServiceBookingSchema>;
export type ServiceBooking = typeof serviceBookings.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Define blog-related types
export interface BlogComment {
  id: string;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
}

// Blog posts schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  slug: text("slug").notNull().unique(),
  images: jsonb("images").$type<string[]>().default([]),
  authorId: integer("author_id").notNull().references(() => users.id),
  approved: boolean("approved").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  likeCount: integer("like_count").default(0).notNull(),
  likedBy: jsonb("liked_by").$type<number[]>().default([]),
  comments: jsonb("comments").$type<BlogComment[]>().default([]),
});

// Define the relations in a separate object
export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Create the insert schema for blog posts
export const insertBlogPostSchema = createInsertSchema(blogPosts, {
  // Custom validation for the content field
  content: z.string().min(100, "Blog content must be at least 100 characters long"),
  // Make sure the summary is not too long
  summary: z.string().max(200, "Summary must be at most 200 characters"),
  // Validate the images array
  images: z.array(z.string().url("Must be a valid URL")).optional(),
  // Validate tags
  tags: z.array(z.string()).optional(),
}).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});
