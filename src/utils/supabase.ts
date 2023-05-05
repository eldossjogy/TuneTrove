export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          color_scheme: string | null
          full_name: string | null
          id: string
          privacy: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          color_scheme?: string | null
          full_name?: string | null
          id: string
          privacy?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          color_scheme?: string | null
          full_name?: string | null
          id?: string
          privacy?: string | null
          updated_at?: string | null
          username?: string | null
        }
      }
      rates: {
        Row: {
          album_id: number | null
          created_at: string | null
          id: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          album_id?: number | null
          created_at?: string | null
          id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          album_id?: number | null
          created_at?: string | null
          id?: number
          updated_at?: string | null
          user_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
