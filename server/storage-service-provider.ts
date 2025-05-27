import { 
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
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";
import { storage } from "./storage";

// Extend the storage implementation with service provider methods
const originalStorage = storage;

// Service Provider methods
originalStorage.getAllServiceProviders = async (): Promise<ServiceProvider[]> => {
  return await db.select().from(serviceProviders)
    .orderBy(asc(serviceProviders.name));
};

originalStorage.getServiceProviderById = async (id: number): Promise<ServiceProvider | undefined> => {
  const [provider] = await db.select().from(serviceProviders)
    .where(eq(serviceProviders.id, id));
  return provider;
};

originalStorage.getServiceProvidersByType = async (serviceType: ServiceType): Promise<ServiceProvider[]> => {
  return await db.select().from(serviceProviders)
    .where(eq(serviceProviders.serviceType, serviceType))
    .orderBy(asc(serviceProviders.name));
};

originalStorage.getServiceProvidersByLocation = async (location: string): Promise<ServiceProvider[]> => {
  return await db.select().from(serviceProviders)
    .where(eq(serviceProviders.location, location))
    .orderBy(asc(serviceProviders.name));
};

originalStorage.createServiceProvider = async (provider: InsertServiceProvider): Promise<ServiceProvider> => {
  try {
    // Ensure arrays are properly formatted
    const data = {
      ...provider,
      availableOptions: Array.isArray(provider.availableOptions) ? provider.availableOptions : []
    };
    
    const [serviceProvider] = await db.insert(serviceProviders).values(data).returning();
    return serviceProvider;
  } catch (error) {
    console.error('Error in createServiceProvider:', error);
    throw error;
  }
};

originalStorage.updateServiceProvider = async (id: number, provider: Partial<InsertServiceProvider>): Promise<ServiceProvider> => {
  const [updatedProvider] = await db.update(serviceProviders)
    .set({
      ...provider,
      updatedAt: new Date()
    })
    .where(eq(serviceProviders.id, id))
    .returning();
  
  if (!updatedProvider) {
    throw new Error(`Service provider with ID ${id} not found`);
  }
  
  return updatedProvider;
};

originalStorage.deleteServiceProvider = async (id: number): Promise<void> => {
  await db.delete(serviceProviders).where(eq(serviceProviders.id, id));
};

// Service Booking methods
originalStorage.getAllServiceBookings = async (): Promise<ServiceBooking[]> => {
  return await db.select().from(serviceBookings)
    .orderBy(desc(serviceBookings.createdAt));
};

originalStorage.getServiceBookingById = async (id: number): Promise<ServiceBooking | undefined> => {
  const [booking] = await db.select().from(serviceBookings)
    .where(eq(serviceBookings.id, id));
  return booking;
};

originalStorage.getServiceBookingsByUserId = async (userId: number): Promise<ServiceBooking[]> => {
  return await db.select().from(serviceBookings)
    .where(eq(serviceBookings.userId, userId))
    .orderBy(desc(serviceBookings.createdAt));
};

originalStorage.getServiceBookingsByProviderId = async (providerId: number): Promise<ServiceBooking[]> => {
  return await db.select().from(serviceBookings)
    .where(eq(serviceBookings.providerId, providerId))
    .orderBy(desc(serviceBookings.createdAt));
};

originalStorage.getServiceBookingsByStatus = async (status: BookingStatus): Promise<ServiceBooking[]> => {
  return await db.select().from(serviceBookings)
    .where(eq(serviceBookings.status, status))
    .orderBy(desc(serviceBookings.createdAt));
};

originalStorage.createServiceBooking = async (booking: InsertServiceBooking): Promise<ServiceBooking> => {
  try {
    const [serviceBooking] = await db.insert(serviceBookings).values(booking).returning();
    return serviceBooking;
  } catch (error) {
    console.error('Error in createServiceBooking:', error);
    throw error;
  }
};

originalStorage.updateServiceBookingStatus = async (id: number, status: BookingStatus): Promise<ServiceBooking> => {
  const [updatedBooking] = await db.update(serviceBookings)
    .set({
      status,
      updatedAt: new Date()
    })
    .where(eq(serviceBookings.id, id))
    .returning();
  
  if (!updatedBooking) {
    throw new Error(`Service booking with ID ${id} not found`);
  }
  
  return updatedBooking;
};

originalStorage.updateServiceBooking = async (id: number, booking: Partial<InsertServiceBooking>): Promise<ServiceBooking> => {
  const [updatedBooking] = await db.update(serviceBookings)
    .set({
      ...booking,
      updatedAt: new Date()
    })
    .where(eq(serviceBookings.id, id))
    .returning();
  
  if (!updatedBooking) {
    throw new Error(`Service booking with ID ${id} not found`);
  }
  
  return updatedBooking;
};

// Payment methods
originalStorage.getAllPayments = async (): Promise<Payment[]> => {
  return await db.select().from(payments)
    .orderBy(desc(payments.createdAt));
};

originalStorage.getPaymentById = async (id: number): Promise<Payment | undefined> => {
  const [payment] = await db.select().from(payments)
    .where(eq(payments.id, id));
  return payment;
};

originalStorage.getPaymentByOrderId = async (orderId: string): Promise<Payment | undefined> => {
  const [payment] = await db.select().from(payments)
    .where(eq(payments.orderId, orderId));
  return payment;
};

originalStorage.getPaymentsByUserId = async (userId: number): Promise<Payment[]> => {
  return await db.select().from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt));
};

originalStorage.getPaymentsByBookingId = async (bookingId: number): Promise<Payment[]> => {
  return await db.select().from(payments)
    .where(eq(payments.bookingId, bookingId))
    .orderBy(desc(payments.createdAt));
};

originalStorage.createPayment = async (payment: InsertPayment): Promise<Payment> => {
  try {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  } catch (error) {
    console.error('Error in createPayment:', error);
    throw error;
  }
};

originalStorage.updatePaymentStatus = async (id: number, status: PaymentStatus): Promise<Payment> => {
  const [updatedPayment] = await db.update(payments)
    .set({
      status,
      updatedAt: new Date()
    })
    .where(eq(payments.id, id))
    .returning();
  
  if (!updatedPayment) {
    throw new Error(`Payment with ID ${id} not found`);
  }
  
  return updatedPayment;
};

export { originalStorage as storage };