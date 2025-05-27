/// <reference types="@vercel/node" />
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

declare const process: {
  env: {
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
  };
};

type ServiceProvider = {
  id?: number;
  name: string;
  service_type: string;
  location: string;
  address: string;
  phone: string;
  email?: string;
  description: string;
  image_url?: string;
  [key: string]: any;
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
    const { method } = request;
    
    switch (method) {
      case 'GET': {
        const { data, error } = await supabase
          .from('service_providers')
          .select('*');
          
        if (error) throw error;
        
        return response.status(200).json({
          status: 'success',
          data
        });
      }
      
      case 'POST': {
        if (request.body) {
          const { data, error } = await supabase
            .from('service_providers')
            .insert(request.body)
            .select();
            
          if (error) throw error;
          
          return response.status(201).json({
            status: 'success',
            data
          });
        }
        
        return response.status(400).json({
          status: 'error',
          message: 'Invalid request body'
        });
      }
      
      default:
        return response.status(405).json({
          status: 'error',
          message: 'Method not allowed'
        });
    }
  } catch (error: any) {
    console.error('API error:', error);
    return response.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
}
