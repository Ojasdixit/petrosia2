import { createClient } from '@supabase/supabase-js';

// Supabase client configuration for browser use
// This uses the anonymous key which is safe to use in client-side code
// It can only access data that is allowed by Row Level Security (RLS) policies

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rgsflnrcptgjnlxpqeih.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnc2ZsbnJjcHRnam5seHBxZWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNzQ5MzgsImV4cCI6MjA2Mzk1MDkzOH0.Srdww8tqMlY09te5a4-g4WBc92uUMENpTlAuqEpOgoc';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: metadata
    }
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

// Example for accessing data using RLS policies
export const getPublicData = async (table: string) => {
  return await supabase.from(table).select('*');
};
