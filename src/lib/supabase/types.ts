export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      availability_blocks: {
        Row: {
          created_at: string;
          day_of_week: number;
          end_time: string;
          id: string;
          is_active: boolean;
          specialist_profile_id: string;
          start_time: string;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          day_of_week: number;
          end_time: string;
          id?: string;
          is_active?: boolean;
          specialist_profile_id: string;
          start_time: string;
          timezone?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          day_of_week?: number;
          end_time?: string;
          id?: string;
          is_active?: boolean;
          specialist_profile_id?: string;
          start_time?: string;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "availability_blocks_specialist_profile_id_fkey";
            columns: ["specialist_profile_id"];
            isOneToOne: false;
            referencedRelation: "specialist_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      availability_exceptions: {
        Row: {
          created_at: string;
          ends_at: string;
          exception_type: "available" | "unavailable";
          id: string;
          is_active: boolean;
          specialist_profile_id: string;
          starts_at: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          ends_at: string;
          exception_type: "available" | "unavailable";
          id?: string;
          is_active?: boolean;
          specialist_profile_id: string;
          starts_at: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          ends_at?: string;
          exception_type?: "available" | "unavailable";
          id?: string;
          is_active?: boolean;
          specialist_profile_id?: string;
          starts_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "availability_exceptions_specialist_profile_id_fkey";
            columns: ["specialist_profile_id"];
            isOneToOne: false;
            referencedRelation: "specialist_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          created_at: string;
          currency: string;
          description: string;
          duration_minutes: number;
          format: "online" | "offline" | "async";
          id: string;
          allow_reschedule: boolean;
          cancellation_policy: string;
          is_monthly_subscription: boolean;
          is_active: boolean;
          location_details: string | null;
          package_notes: string;
          package_validity_weeks: number | null;
          price_amount: number;
          service_type: "one_time" | "package";
          sessions_count: number | null;
          sessions_per_week: number | null;
          sort_order: number;
          specialist_profile_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          allow_reschedule?: boolean;
          cancellation_policy?: string;
          created_at?: string;
          currency?: string;
          description?: string;
          duration_minutes: number;
          format?: "online" | "offline" | "async";
          id?: string;
          is_monthly_subscription?: boolean;
          is_active?: boolean;
          location_details?: string | null;
          package_notes?: string;
          package_validity_weeks?: number | null;
          price_amount?: number;
          service_type?: "one_time" | "package";
          sessions_count?: number | null;
          sessions_per_week?: number | null;
          sort_order?: number;
          specialist_profile_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          allow_reschedule?: boolean;
          cancellation_policy?: string;
          created_at?: string;
          currency?: string;
          description?: string;
          duration_minutes?: number;
          format?: "online" | "offline" | "async";
          id?: string;
          is_monthly_subscription?: boolean;
          is_active?: boolean;
          location_details?: string | null;
          package_notes?: string;
          package_validity_weeks?: number | null;
          price_amount?: number;
          service_type?: "one_time" | "package";
          sessions_count?: number | null;
          sessions_per_week?: number | null;
          sort_order?: number;
          specialist_profile_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_specialist_profile_id_fkey";
            columns: ["specialist_profile_id"];
            isOneToOne: false;
            referencedRelation: "specialist_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      specialist_profiles: {
        Row: {
          avatar_url: string | null;
          bio: string;
          contact_links: Json;
          created_at: string;
          display_name: string;
          id: string;
          is_accepting_bookings: boolean;
          languages: string[];
          profession: string;
          slug: string;
          timezone: string;
          updated_at: string;
          user_id: string;
          visibility: "public" | "private" | "hidden";
          working_rules: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string;
          contact_links?: Json;
          created_at?: string;
          display_name: string;
          id?: string;
          is_accepting_bookings?: boolean;
          languages?: string[];
          profession: string;
          slug: string;
          timezone?: string;
          updated_at?: string;
          user_id: string;
          visibility?: "public" | "private" | "hidden";
          working_rules?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string;
          contact_links?: Json;
          created_at?: string;
          display_name?: string;
          id?: string;
          is_accepting_bookings?: boolean;
          languages?: string[];
          profession?: string;
          slug?: string;
          timezone?: string;
          updated_at?: string;
          user_id?: string;
          visibility?: "public" | "private" | "hidden";
          working_rules?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_specialist_profile_owner: {
        Args: { profile_id: string };
        Returns: boolean;
      };
      is_specialist_profile_public: {
        Args: { profile_id: string };
        Returns: boolean;
      };
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
