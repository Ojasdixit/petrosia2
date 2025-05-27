import {
  users,
  User,
  InsertUser,
  BlogComment,
  petListings,
  PetListing,
  InsertPetListing,
  adoptionListings,
  AdoptionListing,
  InsertAdoptionListing,
  AdoptionStatus,
  newsArticles,
  NewsArticle,
  InsertNewsArticle,
  NewsSource,
  dogBreeds,
  DogBreed,
  InsertDogBreed,
  DogSize,
  eventRegistrations,
  EventRegistration,
  InsertEventRegistration,
  RegistrationStatus,
  sellerReviews,
  SellerReview,
  InsertSellerReview,
  blogPosts,
  BlogPost,
  InsertBlogPost,
  serviceProviders,
  ServiceProvider,
  InsertServiceProvider,
  ServiceType,
  serviceBookings,
  ServiceBooking,
  InsertServiceBooking,
  BookingStatus,
  payments,
  Payment,
  InsertPayment,
  PaymentStatus
} from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq, desc, and, or, like, asc, inArray } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Type definition for SessionStore
type SessionStore = session.Store;

const PostgresSessionStore = connectPg(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Pet listing operations
  getAllPetListings(): Promise<PetListing[]>;
  getPetListingById(id: number): Promise<PetListing | undefined>;
  getPetListingsBySellerId(sellerId: number): Promise<PetListing[]>;
  createPetListing(listing: InsertPetListing): Promise<PetListing>;
  updatePetListing(id: number, listing: Partial<InsertPetListing>): Promise<PetListing>;
  deletePetListing(id: number): Promise<void>;
  
  // Adoption listing operations
  getAllAdoptionListings(): Promise<AdoptionListing[]>;
  getAdoptionListingById(id: number): Promise<AdoptionListing | undefined>;
  getAdoptionListingsByAdminId(adminId: number): Promise<AdoptionListing[]>;
  getAdoptionListingsByStatus(status: AdoptionStatus): Promise<AdoptionListing[]>;
  createAdoptionListing(listing: InsertAdoptionListing): Promise<AdoptionListing>;
  updateAdoptionListing(id: number, listing: Partial<InsertAdoptionListing>): Promise<AdoptionListing>;
  updateAdoptionStatus(id: number, status: AdoptionStatus): Promise<AdoptionListing>;
  deleteAdoptionListing(id: number): Promise<void>;
  
  // Seller reviews operations
  getReviewsBySellerId(sellerId: number): Promise<SellerReview[]>;
  getReviewsByReviewerId(reviewerId: number): Promise<SellerReview[]>;
  getReviewById(id: number): Promise<SellerReview | undefined>;
  createReview(review: InsertSellerReview): Promise<SellerReview>;
  updateReview(id: number, review: Partial<InsertSellerReview>): Promise<SellerReview>;
  deleteReview(id: number): Promise<void>;
  respondToReview(id: number, response: string): Promise<SellerReview>;
  getSellerAverageRating(sellerId: number): Promise<number>;
  
  // News articles operations
  getAllNewsArticles(): Promise<NewsArticle[]>;
  getNewsArticleById(id: number): Promise<NewsArticle | undefined>;
  getLatestNewsArticles(limit: number): Promise<NewsArticle[]>;
  getNewsBySource(source: NewsSource): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  deleteNewsArticleById(id: number): Promise<void>;
  
  // Dog breeds operations
  getAllDogBreeds(): Promise<DogBreed[]>;
  getDogBreedById(id: number): Promise<DogBreed | undefined>;
  getDogBreedByName(name: string): Promise<DogBreed | undefined>;
  getPopularDogBreeds(limit: number): Promise<DogBreed[]>;
  getDogBreedsBySize(size: DogSize): Promise<DogBreed[]>;
  getDogBreedsByGroup(group: string): Promise<DogBreed[]>;
  createDogBreed(breed: InsertDogBreed): Promise<DogBreed>;
  updateDogBreed(id: number, breed: Partial<InsertDogBreed>): Promise<DogBreed>;
  deleteDogBreed(id: number): Promise<void>;
  compareDogBreeds(breedIds: number[]): Promise<DogBreed[]>;
  
  // Event registration operations
  getAllEventRegistrations(): Promise<EventRegistration[]>;
  getEventRegistrationById(id: number): Promise<EventRegistration | undefined>;
  getEventRegistrationsByUserId(userId: number): Promise<EventRegistration[]>;
  getEventRegistrationsByStatus(status: RegistrationStatus): Promise<EventRegistration[]>;
  getEventRegistrationsByEventId(eventId: number): Promise<EventRegistration[]>;
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
  updateEventRegistrationStatus(id: number, status: RegistrationStatus): Promise<EventRegistration>;
  updateEventRegistration(id: number, registration: Partial<InsertEventRegistration>): Promise<EventRegistration>;
  deleteEventRegistration(id: number): Promise<void>;
  
  // Blog post operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostsByAuthorId(authorId: number): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Service Provider operations
  getAllServiceProviders(): Promise<ServiceProvider[]>;
  getServiceProviderById(id: number): Promise<ServiceProvider | undefined>;
  getServiceProvidersByType(serviceType: ServiceType): Promise<ServiceProvider[]>;
  getServiceProvidersByLocation(location: string): Promise<ServiceProvider[]>;
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  updateServiceProvider(id: number, provider: Partial<InsertServiceProvider>): Promise<ServiceProvider>;
  deleteServiceProvider(id: number): Promise<void>;
  
  // Service Booking operations
  getAllServiceBookings(): Promise<ServiceBooking[]>;
  getServiceBookingById(id: number): Promise<ServiceBooking | undefined>;
  getServiceBookingsByUserId(userId: number): Promise<ServiceBooking[]>;
  getServiceBookingsByProviderId(providerId: number): Promise<ServiceBooking[]>;
  getServiceBookingsByStatus(status: BookingStatus): Promise<ServiceBooking[]>;
  createServiceBooking(booking: InsertServiceBooking): Promise<ServiceBooking>;
  updateServiceBookingStatus(id: number, status: BookingStatus): Promise<ServiceBooking>;
  updateServiceBooking(id: number, booking: Partial<InsertServiceBooking>): Promise<ServiceBooking>;
  
  // Payment operations
  getAllPayments(): Promise<Payment[]>;
  getPaymentById(id: number): Promise<Payment | undefined>;
  getPaymentByOrderId(orderId: string): Promise<Payment | undefined>;
  getPaymentsByUserId(userId: number): Promise<Payment[]>;
  getPaymentsByBookingId(bookingId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: PaymentStatus): Promise<Payment>;
  
  // Session store
  sessionStore: SessionStore;
}

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  public sessionStore: SessionStore;

  constructor() {
    // Initialize the session store with PostgreSQL
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values([insertUser]).returning();
    return user;
  }

  // Pet listing methods
  async getAllPetListings(): Promise<PetListing[]> {
    return await db.select().from(petListings);
  }

  async getPetListingById(id: number): Promise<PetListing | undefined> {
    const [listing] = await db.select().from(petListings).where(eq(petListings.id, id));
    return listing;
  }

  async getPetListingsBySellerId(sellerId: number): Promise<PetListing[]> {
    console.log(`DEBUG: Getting listings for seller ID: ${sellerId}`);
    
    // Generate SQL query for debugging
    const query = db.select().from(petListings).where(eq(petListings.sellerId, sellerId)).toSQL();
    console.log(`DEBUG: SQL Query:`, query);
    
    // Execute query
    const results = await db.select().from(petListings).where(eq(petListings.sellerId, sellerId));
    console.log(`DEBUG: Found ${results.length} results`);
    
    if (results.length > 0) {
      console.log(`DEBUG: Sample result:`, JSON.stringify(results[0]));
    }
    
    return results;
  }
  
  async getPetListingsByBreed(breed: string): Promise<PetListing[]> {
    console.log(`Getting pet listings for breed: ${breed}`);
    
    // We use 'like' to do a case-insensitive search
    const results = await db.select()
                           .from(petListings)
                           .where(and(
                             like(petListings.breed, `%${breed}%`),
                             eq(petListings.approved, true)
                           ))
                           .orderBy(desc(petListings.createdAt));
    
    console.log(`Found ${results.length} listings for breed: ${breed}`);
    return results;
  }

  async createPetListing(listing: InsertPetListing): Promise<PetListing> {
    try {
      // Make sure images is properly typed as a string array
      let imageArray: string[] = [];
      
      if (listing.images) {
        if (Array.isArray(listing.images)) {
          // Keep only string values
          imageArray = listing.images.filter((img): img is string => 
            typeof img === 'string' && img.trim() !== ''
          );
        } else if (typeof listing.images === 'string') {
          // Handle single string case
          imageArray = [listing.images];
        }
      }
      
      // Create a new object with properly typed images field
      const data = {
        ...listing,
        images: imageArray
      };
      
      console.log('Inserting pet listing with data:', JSON.stringify(data));
      
      const [petListing] = await db.insert(petListings).values(data).returning();
      console.log('Successfully created pet listing:', petListing);
      return petListing;
    } catch (error) {
      console.error('Error in createPetListing:', error);
      throw error;
    }
  }

  async updatePetListing(id: number, listing: Partial<InsertPetListing>): Promise<PetListing> {
    const [updatedListing] = await db.update(petListings)
      .set({
        ...listing,
        updatedAt: new Date()
      })
      .where(eq(petListings.id, id))
      .returning();
    
    if (!updatedListing) {
      throw new Error(`Pet listing with ID ${id} not found`);
    }
    
    return updatedListing;
  }

  async deletePetListing(id: number): Promise<void> {
    await db.delete(petListings).where(eq(petListings.id, id));
  }

  // Adoption listing methods
  async getAllAdoptionListings(): Promise<AdoptionListing[]> {
    return await db.select().from(adoptionListings);
  }

  async getAdoptionListingById(id: number): Promise<AdoptionListing | undefined> {
    const [listing] = await db.select().from(adoptionListings).where(eq(adoptionListings.id, id));
    return listing;
  }

  async getAdoptionListingsByAdminId(adminId: number): Promise<AdoptionListing[]> {
    return await db.select().from(adoptionListings).where(eq(adoptionListings.adminId, adminId));
  }

  async getAdoptionListingsByStatus(status: AdoptionStatus): Promise<AdoptionListing[]> {
    return await db.select().from(adoptionListings).where(eq(adoptionListings.status, status));
  }

  async createAdoptionListing(listing: InsertAdoptionListing): Promise<AdoptionListing> {
    const [adoptionListing] = await db.insert(adoptionListings).values([listing]).returning();
    return adoptionListing;
  }

  async updateAdoptionListing(id: number, listing: Partial<InsertAdoptionListing>): Promise<AdoptionListing> {
    const [updatedListing] = await db.update(adoptionListings)
      .set({
        ...listing,
        updatedAt: new Date()
      })
      .where(eq(adoptionListings.id, id))
      .returning();
    
    if (!updatedListing) {
      throw new Error(`Adoption listing with ID ${id} not found`);
    }
    
    return updatedListing;
  }

  async updateAdoptionStatus(id: number, status: AdoptionStatus): Promise<AdoptionListing> {
    const [updatedListing] = await db.update(adoptionListings)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(adoptionListings.id, id))
      .returning();
    
    if (!updatedListing) {
      throw new Error(`Adoption listing with ID ${id} not found`);
    }
    
    return updatedListing;
  }

  async deleteAdoptionListing(id: number): Promise<void> {
    await db.delete(adoptionListings).where(eq(adoptionListings.id, id));
  }

  // News articles methods
  async getAllNewsArticles(): Promise<NewsArticle[]> {
    return await db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt));
  }

  async getNewsArticleById(id: number): Promise<NewsArticle | undefined> {
    const [article] = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
    return article;
  }

  async getLatestNewsArticles(limit: number): Promise<NewsArticle[]> {
    return await db.select().from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit);
  }

  async getNewsBySource(source: NewsSource): Promise<NewsArticle[]> {
    return await db.select().from(newsArticles)
      .where(eq(newsArticles.source, source))
      .orderBy(desc(newsArticles.publishedAt));
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    try {
      // Create a new object with properly typed categories field if needed
      let data = { ...article };
      
      if (article.categories && !Array.isArray(article.categories)) {
        data = {
          ...article,
          categories: Array.isArray(article.categories) ? article.categories : []
        };
      }
      
      const [newsArticle] = await db.insert(newsArticles).values(data).returning();
      return newsArticle;
    } catch (error) {
      console.error('Error in createNewsArticle:', error);
      throw error;
    }
  }

  async deleteNewsArticleById(id: number): Promise<void> {
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
  }

  // Dog breeds methods
  async getAllDogBreeds(): Promise<DogBreed[]> {
    return await db.select().from(dogBreeds).orderBy(asc(dogBreeds.name));
  }

  async getDogBreedById(id: number): Promise<DogBreed | undefined> {
    const [breed] = await db.select().from(dogBreeds).where(eq(dogBreeds.id, id));
    return breed;
  }

  async getDogBreedByName(name: string): Promise<DogBreed | undefined> {
    const [breed] = await db.select().from(dogBreeds).where(eq(dogBreeds.name, name));
    return breed;
  }

  async getPopularDogBreeds(limit: number): Promise<DogBreed[]> {
    return await db.select().from(dogBreeds)
      .orderBy(desc(dogBreeds.popularity))
      .limit(limit);
  }

  async getDogBreedsBySize(size: DogSize): Promise<DogBreed[]> {
    return await db.select().from(dogBreeds)
      .where(eq(dogBreeds.size, size))
      .orderBy(asc(dogBreeds.name));
  }

  async getDogBreedsByGroup(group: string): Promise<DogBreed[]> {
    return await db.select().from(dogBreeds)
      .where(eq(dogBreeds.group, group))
      .orderBy(asc(dogBreeds.name));
  }

  async createDogBreed(breed: InsertDogBreed): Promise<DogBreed> {
    try {
      // Ensure arrays are properly formatted
      const data = {
        ...breed,
        coatColors: Array.isArray(breed.coatColors) ? breed.coatColors : [],
        temperament: Array.isArray(breed.temperament) ? breed.temperament : [],
        healthIssues: Array.isArray(breed.healthIssues) ? breed.healthIssues : [],
        variants: Array.isArray(breed.variants) ? breed.variants : [],
        funFacts: Array.isArray(breed.funFacts) ? breed.funFacts : [],
        galleryImages: Array.isArray(breed.galleryImages) ? breed.galleryImages : []
      };
      
      const [dogBreed] = await db.insert(dogBreeds).values(data).returning();
      return dogBreed;
    } catch (error) {
      console.error('Error in createDogBreed:', error);
      throw error;
    }
  }

  async updateDogBreed(id: number, breed: Partial<InsertDogBreed>): Promise<DogBreed> {
    const [updatedBreed] = await db.update(dogBreeds)
      .set({
        ...breed,
        updatedAt: new Date()
      })
      .where(eq(dogBreeds.id, id))
      .returning();
    
    if (!updatedBreed) {
      throw new Error(`Dog breed with ID ${id} not found`);
    }
    
    return updatedBreed;
  }

  async deleteDogBreed(id: number): Promise<void> {
    await db.delete(dogBreeds).where(eq(dogBreeds.id, id));
  }

  async compareDogBreeds(breedIds: number[]): Promise<DogBreed[]> {
    if (!breedIds.length) {
      return [];
    }
    
    // Use SQL IN operator to fetch all requested breeds
    const breeds = await db.select().from(dogBreeds)
      .where(inArray(dogBreeds.id, breedIds))
      .orderBy(asc(dogBreeds.name));
    
    return breeds;
  }

  // Event registration methods
  async getAllEventRegistrations(): Promise<EventRegistration[]> {
    return await db.select().from(eventRegistrations)
      .orderBy(desc(eventRegistrations.createdAt));
  }

  async getEventRegistrationById(id: number): Promise<EventRegistration | undefined> {
    const [registration] = await db.select().from(eventRegistrations)
      .where(eq(eventRegistrations.id, id));
    return registration;
  }

  async getEventRegistrationsByUserId(userId: number): Promise<EventRegistration[]> {
    return await db.select().from(eventRegistrations)
      .where(eq(eventRegistrations.userId, userId))
      .orderBy(desc(eventRegistrations.createdAt));
  }

  async getEventRegistrationsByStatus(status: RegistrationStatus): Promise<EventRegistration[]> {
    return await db.select().from(eventRegistrations)
      .where(eq(eventRegistrations.status, status))
      .orderBy(desc(eventRegistrations.createdAt));
  }

  async getEventRegistrationsByEventId(eventId: number): Promise<EventRegistration[]> {
    return await db.select().from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, eventId))
      .orderBy(desc(eventRegistrations.createdAt));
  }

  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration> {
    try {
      const [eventRegistration] = await db.insert(eventRegistrations)
        .values(registration)
        .returning();
      return eventRegistration;
    } catch (error) {
      console.error('Error in createEventRegistration:', error);
      throw error;
    }
  }

  async updateEventRegistrationStatus(id: number, status: RegistrationStatus): Promise<EventRegistration> {
    const [updatedRegistration] = await db.update(eventRegistrations)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(eventRegistrations.id, id))
      .returning();
    
    if (!updatedRegistration) {
      throw new Error(`Event registration with ID ${id} not found`);
    }
    
    return updatedRegistration;
  }

  async updateEventRegistration(id: number, registration: Partial<InsertEventRegistration>): Promise<EventRegistration> {
    const [updatedRegistration] = await db.update(eventRegistrations)
      .set({
        ...registration,
        updatedAt: new Date()
      })
      .where(eq(eventRegistrations.id, id))
      .returning();
    
    if (!updatedRegistration) {
      throw new Error(`Event registration with ID ${id} not found`);
    }
    
    return updatedRegistration;
  }

  async deleteEventRegistration(id: number): Promise<void> {
    await db.delete(eventRegistrations).where(eq(eventRegistrations.id, id));
  }

  // Blog post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPostsByAuthorId(authorId: number): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.authorId, authorId))
      .orderBy(desc(blogPosts.createdAt));
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    try {
      // Ensure arrays are properly formatted
      let imageArray: string[] = [];
      let tagArray: string[] = [];
      
      if (post.images) {
        if (Array.isArray(post.images)) {
          imageArray = post.images.filter((img): img is string => 
            typeof img === 'string' && img.trim() !== ''
          );
        } else if (typeof post.images === 'string') {
          imageArray = [post.images];
        }
      }
      
      if (post.tags) {
        if (Array.isArray(post.tags)) {
          tagArray = post.tags.filter((tag): tag is string => 
            typeof tag === 'string' && tag.trim() !== ''
          );
        } else if (typeof post.tags === 'string') {
          tagArray = [post.tags];
        }
      }
      
      // Create a new object with properly typed fields
      const data = {
        ...post,
        images: imageArray,
        tags: tagArray
      };
      
      console.log('Inserting blog post with data:', JSON.stringify(data));
      
      const [blogPost] = await db.insert(blogPosts).values(data).returning();
      console.log('Successfully created blog post:', blogPost);
      return blogPost;
    } catch (error) {
      console.error('Error in createBlogPost:', error);
      throw error;
    }
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    try {
      // Handle arrays properly if they exist in the update
      let updateData: any = { ...post };
      
      if (post.images !== undefined) {
        let imageArray: string[] = [];
        if (Array.isArray(post.images)) {
          imageArray = post.images.filter((img): img is string => 
            typeof img === 'string' && img.trim() !== ''
          );
        } else if (typeof post.images === 'string') {
          imageArray = [post.images];
        }
        updateData.images = imageArray;
      }
      
      if (post.tags !== undefined) {
        let tagArray: string[] = [];
        if (Array.isArray(post.tags)) {
          tagArray = post.tags.filter((tag): tag is string => 
            typeof tag === 'string' && tag.trim() !== ''
          );
        } else if (typeof post.tags === 'string') {
          tagArray = [post.tags];
        }
        updateData.tags = tagArray;
      }
      
      // Set updatedAt timestamp if not already set
      if (!updateData.updatedAt) {
        updateData.updatedAt = new Date();
      }
      
      const [updatedPost] = await db.update(blogPosts)
        .set(updateData)
        .where(eq(blogPosts.id, id))
        .returning();
      
      if (!updatedPost) {
        throw new Error(`Blog post with ID ${id} not found`);
      }
      
      return updatedPost;
    } catch (error) {
      console.error('Error in updateBlogPost:', error);
      throw error;
    }
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
  
  async likeBlogPost(postId: number, userId: number): Promise<BlogPost> {
    try {
      // First get the current post to check if already liked
      const post = await this.getBlogPostById(postId);
      if (!post) {
        throw new Error(`Blog post with ID ${postId} not found`);
      }
      
      // Check if user already liked the post
      const likedBy = post.likedBy as number[] || [];
      const isAlreadyLiked = likedBy.includes(userId);
      
      // Update like count and likedBy array
      let newLikedBy = [...likedBy];
      let newLikeCount = post.likeCount || 0;
      
      if (isAlreadyLiked) {
        // Unlike: Remove user from likedBy and decrease count
        newLikedBy = newLikedBy.filter(id => id !== userId);
        newLikeCount = Math.max(0, newLikeCount - 1);
      } else {
        // Like: Add user to likedBy and increase count
        newLikedBy.push(userId);
        newLikeCount = newLikeCount + 1;
      }
      
      // Update the blog post
      const [updatedPost] = await db.update(blogPosts)
        .set({
          likeCount: newLikeCount,
          likedBy: newLikedBy,
          updatedAt: new Date()
        })
        .where(eq(blogPosts.id, postId))
        .returning();
      
      return updatedPost;
    } catch (error) {
      console.error('Error in likeBlogPost:', error);
      throw error;
    }
  }
  
  async addCommentToBlogPost(
    postId: number, 
    comment: { authorId: number; authorName: string; content: string }
  ): Promise<BlogPost> {
    try {
      // Get the current post
      const post = await this.getBlogPostById(postId);
      if (!post) {
        throw new Error(`Blog post with ID ${postId} not found`);
      }
      
      // Create a new comment
      const newComment: BlogComment = {
        id: crypto.randomUUID(),
        content: comment.content,
        authorId: comment.authorId,
        authorName: comment.authorName,
        createdAt: new Date().toISOString()
      };
      
      // Add to existing comments
      const existingComments = post.comments as BlogComment[] || [];
      const updatedComments = [...existingComments, newComment];
      
      // Update the blog post
      const [updatedPost] = await db.update(blogPosts)
        .set({
          comments: updatedComments,
          updatedAt: new Date()
        })
        .where(eq(blogPosts.id, postId))
        .returning();
      
      return updatedPost;
    } catch (error) {
      console.error('Error in addCommentToBlogPost:', error);
      throw error;
    }
  }
}

// Export an instance of the storage implementation
export const storage = new DatabaseStorage();
