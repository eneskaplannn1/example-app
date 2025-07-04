import { supabase } from '../utils/supabase';

// Database configuration
interface DatabaseConfig {
  type: 'supabase' | 'mssql';
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
}

// Default to Supabase for now, can be configured later
const dbConfig: DatabaseConfig = {
  type: 'supabase',
};

export class DatabaseService {
  private static instance: DatabaseService;
  private config: DatabaseConfig;

  private constructor(config: DatabaseConfig) {
    this.config = config;
  }

  public static getInstance(config?: DatabaseConfig): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(config || dbConfig);
    }
    return DatabaseService.instance;
  }

  // Generic query method that works with both Supabase and MSSQL
  async query<T = any>(
    table: string,
    options: {
      select?: string;
      where?: Record<string, any>;
      orderBy?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<T[]> {
    if (this.config.type === 'supabase') {
      return this.supabaseQuery<T>(table, options);
    } else {
      return this.mssqlQuery<T>(table, options);
    }
  }

  // Supabase query implementation
  private async supabaseQuery<T>(
    table: string,
    options: {
      select?: string;
      where?: Record<string, any>;
      orderBy?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<T[]> {
    let query = supabase.from(table).select(options.select || '*');

    // Apply where conditions
    if (options.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy);
    }

    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    // Apply offset
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`);
    }

    return (data as T[]) || [];
  }

  // MSSQL query implementation (placeholder for future implementation)
  private async mssqlQuery<T>(
    table: string,
    options: {
      select?: string;
      where?: Record<string, any>;
      orderBy?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<T[]> {
    // TODO: Implement MSSQL connection and query logic
    // This would use a library like mssql or tedious
    throw new Error('MSSQL implementation not yet available');
  }

  // Insert method
  async insert<T = any>(table: string, data: Record<string, any>): Promise<T | null> {
    if (this.config.type === 'supabase') {
      const { data: result, error } = await supabase.from(table).insert([data]).select().single();

      if (error) {
        throw new Error(`Supabase insert error: ${error.message}`);
      }

      return result;
    } else {
      // TODO: Implement MSSQL insert
      throw new Error('MSSQL implementation not yet available');
    }
  }

  // Update method
  async update<T = any>(
    table: string,
    id: string,
    updates: Record<string, any>
  ): Promise<T | null> {
    if (this.config.type === 'supabase') {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Supabase update error: ${error.message}`);
      }

      return data;
    } else {
      // TODO: Implement MSSQL update
      throw new Error('MSSQL implementation not yet available');
    }
  }

  // Delete method
  async delete(table: string, id: string): Promise<void> {
    if (this.config.type === 'supabase') {
      const { error } = await supabase.from(table).delete().eq('id', id);

      if (error) {
        throw new Error(`Supabase delete error: ${error.message}`);
      }
    } else {
      // TODO: Implement MSSQL delete
      throw new Error('MSSQL implementation not yet available');
    }
  }

  // Raw query method for complex queries
  async rawQuery<T = any>(query: string, params?: any[]): Promise<T[]> {
    if (this.config.type === 'supabase') {
      // Supabase doesn't support raw SQL queries in the client
      throw new Error('Raw queries not supported in Supabase client');
    } else {
      // TODO: Implement MSSQL raw query
      throw new Error('MSSQL implementation not yet available');
    }
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();

// Helper functions for common operations
export async function getUserPlantsWithDetails(userId: string) {
  return databaseService.query('user_plants', {
    select: `
      *,
      plants(*)
    `,
    where: { user_id: userId },
    orderBy: 'acquired_date',
  });
}

export async function getCareRemindersByUser(userId: string) {
  return databaseService.query('care_reminders', {
    select: `
      *,
      user_plants!inner(user_id)
    `,
    where: { 'user_plants.user_id': userId },
    orderBy: 'reminder_time',
  });
}

export async function getWeatherAlertsByUser(userId: string) {
  return databaseService.query('weather_alerts', {
    where: { user_id: userId },
    orderBy: 'alert_time',
  });
}
