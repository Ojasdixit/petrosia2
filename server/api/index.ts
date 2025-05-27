/// <reference types="@vercel/node" />
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

type ApiResponse = {
  status: string;
  message: string;
  version?: string;
  environment?: string;
};

declare const process: {
  env: {
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    NODE_ENV?: string;
  };
};

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || ''
);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // Simple health check response
    return response.status(200).json({
      status: 'success',
      message: 'Petrosia Marketplace API is running',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('API error:', error);
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
}
