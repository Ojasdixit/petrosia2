-- Drop all tables in the database
DO $$ DECLARE
    r RECORD;
BEGIN
    -- Disable triggers
    EXECUTE 'SET session_replication_role = replica';
    
    -- Drop all tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Re-enable triggers
    EXECUTE 'SET session_replication_role = origin';
END $$;