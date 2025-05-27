declare module '@supabase/supabase-js' {
  export interface SupabaseClientOptions {
    schema?: string;
  }

  export interface SupabaseClient<Database = any, SchemaName extends string & keyof Database = 'public' extends keyof Database ? 'public' : string & keyof Database> {
    from<TableName extends string & keyof Database[SchemaName]['Tables']>(
      table: TableName
    ): any; // Simplified for brevity
    
    // Add other Supabase client methods as needed
    rpc(fn: string, params?: object): any;
    auth: any;
    storage: any;
  }

  export function createClient<Database = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: SupabaseClientOptions<Database>
  ): SupabaseClient<Database>;

  // Add other Supabase exports as needed
  export const _supabase: any;
}
