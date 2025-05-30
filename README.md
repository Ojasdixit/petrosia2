# Petrosia Marketplace

A full-stack web application for pet services and marketplace with modern client-server architecture.

## Project Structure

The project follows a clean client-server architecture:

```
PetrosiaMarketplace/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions and services
│   │   │   └── supabase.ts  # Client-side Supabase integration
│   │   └── pages/      # Application pages
│   └── .env            # Client-side environment variables
│
├── server/             # Backend Express application
│   ├── auth.ts         # Authentication logic
│   ├── cloudinary.ts   # Unified Cloudinary service for media
│   ├── db.ts           # Database connection 
│   ├── routes.ts       # API routes
│   ├── supabase.ts     # Supabase service
│   ├── storage.ts      # Storage service
│   └── upload-handlers.ts # File upload handlers
│
├── archive/            # Archived redundant files
│   ├── scripts/        # Archived utility scripts
│   └── sql/            # Archived SQL files
│
└── .env                # Server-side environment variables
```

## Database Schema

The application uses Supabase with the following main tables:

- `users` - User accounts and authentication
- `service_providers` - Pet service providers (vets, groomers, walkers, trainers)
- `service_bookings` - Bookings for services
- `payments` - Payment records
- `pet_listings` - Listings for pets for sale
- `adoption_listings` - Listings for pets for adoption
- `dog_breeds` - Information about dog breeds
- `blog_posts` - Blog content
- `media_files` - Media storage metadata

## Environment Configuration

### Server Environment Variables (.env)

- Supabase configuration (URL, keys)
- Cloudinary configuration (cloud name, API keys)
- Database connection strings
- Session secrets
- Payment gateway credentials (Cashfree)

### Client Environment Variables (client/.env)

- Supabase public URL and anonymous key
- Other client-specific settings

## External Services

The application integrates with:

1. **Supabase** - For database and authentication
2. **Cloudinary** - For media storage and processing
3. **Cashfree** - For payment processing

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm run server
   ```

3. Start the client:
   ```
   npm run client
   ```

4. For development with both client and server:
   ```
   npm run dev
   ```

## Code Organization

- The codebase follows a modern separation of concerns
- Client-side code is independent of server implementation
- API services handle communication between client and server
- Authentication is managed through Supabase
#   p e t r o s i a 2  
 