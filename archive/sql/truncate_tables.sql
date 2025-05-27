-- Truncate all tables in the database
TRUNCATE TABLE adoption_listings, blog_posts, dog_breeds, event_registrations, 
             media_files, news_articles, payments, pet_listings, 
             service_bookings, service_providers, session, users RESTART IDENTITY CASCADE;