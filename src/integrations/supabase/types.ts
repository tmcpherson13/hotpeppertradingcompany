export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          performed_by: string
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by: string
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      deactivated_accounts: {
        Row: {
          deactivated_at: string
          deactivated_by: string
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          deactivated_at?: string
          deactivated_by: string
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          deactivated_at?: string
          deactivated_by?: string
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      enrichment_jobs: {
        Row: {
          completed_items: number
          created_at: string
          created_by: string | null
          current_pepper_id: string | null
          current_pepper_name: string | null
          current_step: string | null
          error_log: Json | null
          estimated_completion: string | null
          id: string
          job_type: string
          settings: Json | null
          started_at: string | null
          status: string
          total_items: number
          updated_at: string
        }
        Insert: {
          completed_items?: number
          created_at?: string
          created_by?: string | null
          current_pepper_id?: string | null
          current_pepper_name?: string | null
          current_step?: string | null
          error_log?: Json | null
          estimated_completion?: string | null
          id?: string
          job_type?: string
          settings?: Json | null
          started_at?: string | null
          status?: string
          total_items?: number
          updated_at?: string
        }
        Update: {
          completed_items?: number
          created_at?: string
          created_by?: string | null
          current_pepper_id?: string | null
          current_pepper_name?: string | null
          current_step?: string | null
          error_log?: Json | null
          estimated_completion?: string | null
          id?: string
          job_type?: string
          settings?: Json | null
          started_at?: string | null
          status?: string
          total_items?: number
          updated_at?: string
        }
        Relationships: []
      }
      enrichment_settings: {
        Row: {
          auto_approve_enabled: boolean
          auto_approve_threshold: number
          id: string
          last_run_at: string | null
          last_run_count: number | null
          schedule_enabled: boolean
          schedule_frequency: string
          schedule_next_run: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          auto_approve_enabled?: boolean
          auto_approve_threshold?: number
          id?: string
          last_run_at?: string | null
          last_run_count?: number | null
          schedule_enabled?: boolean
          schedule_frequency?: string
          schedule_next_run?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          auto_approve_enabled?: boolean
          auto_approve_threshold?: number
          id?: string
          last_run_at?: string | null
          last_run_count?: number | null
          schedule_enabled?: boolean
          schedule_frequency?: string
          schedule_next_run?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      featured_consortium: {
        Row: {
          consortium_index: number
          id: string
          last_rotated_at: string
          updated_at: string
        }
        Insert: {
          consortium_index?: number
          id?: string
          last_rotated_at?: string
          updated_at?: string
        }
        Update: {
          consortium_index?: number
          id?: string
          last_rotated_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      hidden_gallery_images: {
        Row: {
          hidden_at: string
          hidden_by: string
          id: string
          image_id: string
          pepper_id: string
        }
        Insert: {
          hidden_at?: string
          hidden_by: string
          id?: string
          image_id: string
          pepper_id: string
        }
        Update: {
          hidden_at?: string
          hidden_by?: string
          id?: string
          image_id?: string
          pepper_id?: string
        }
        Relationships: []
      }
      pending_password_changes: {
        Row: {
          created_at: string
          created_by: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      pepper_enrichment_queue: {
        Row: {
          auto_approved: boolean | null
          confidence_score: number | null
          created_at: string
          created_by: string | null
          id: string
          pepper_id: string
          proposed_aroma_notes: string | null
          proposed_culinary_uses: string | null
          proposed_description: string | null
          proposed_flavor_notes: string | null
          proposed_historical_notes: string | null
          proposed_trade_route: string | null
          research_ids: string[] | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          source_citations: Json | null
          status: string
        }
        Insert: {
          auto_approved?: boolean | null
          confidence_score?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          pepper_id: string
          proposed_aroma_notes?: string | null
          proposed_culinary_uses?: string | null
          proposed_description?: string | null
          proposed_flavor_notes?: string | null
          proposed_historical_notes?: string | null
          proposed_trade_route?: string | null
          research_ids?: string[] | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_citations?: Json | null
          status?: string
        }
        Update: {
          auto_approved?: boolean | null
          confidence_score?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          pepper_id?: string
          proposed_aroma_notes?: string | null
          proposed_culinary_uses?: string | null
          proposed_description?: string | null
          proposed_flavor_notes?: string | null
          proposed_historical_notes?: string | null
          proposed_trade_route?: string | null
          research_ids?: string[] | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_citations?: Json | null
          status?: string
        }
        Relationships: []
      }
      pepper_image_proposals: {
        Row: {
          author: string | null
          confidence_score: number | null
          created_at: string
          enrichment_job_id: string | null
          id: string
          image_url: string | null
          license: string | null
          pepper_id: string
          prompt_used: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          source_type: string
          source_url: string | null
          status: string
          storage_path: string | null
        }
        Insert: {
          author?: string | null
          confidence_score?: number | null
          created_at?: string
          enrichment_job_id?: string | null
          id?: string
          image_url?: string | null
          license?: string | null
          pepper_id: string
          prompt_used?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_type: string
          source_url?: string | null
          status?: string
          storage_path?: string | null
        }
        Update: {
          author?: string | null
          confidence_score?: number | null
          created_at?: string
          enrichment_job_id?: string | null
          id?: string
          image_url?: string | null
          license?: string | null
          pepper_id?: string
          prompt_used?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_type?: string
          source_url?: string | null
          status?: string
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_enrichment_job"
            columns: ["enrichment_job_id"]
            isOneToOne: false
            referencedRelation: "enrichment_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      pepper_overrides: {
        Row: {
          aroma_notes: string | null
          culinary_uses: string | null
          description: string | null
          enrichment_version: number | null
          flavor_notes: string | null
          heat_level: string | null
          historical_notes: string | null
          id: string
          origin: string | null
          pepper_id: string
          scoville_max: number | null
          scoville_min: number | null
          source_citations: Json | null
          trade_route: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          aroma_notes?: string | null
          culinary_uses?: string | null
          description?: string | null
          enrichment_version?: number | null
          flavor_notes?: string | null
          heat_level?: string | null
          historical_notes?: string | null
          id?: string
          origin?: string | null
          pepper_id: string
          scoville_max?: number | null
          scoville_min?: number | null
          source_citations?: Json | null
          trade_route?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          aroma_notes?: string | null
          culinary_uses?: string | null
          description?: string | null
          enrichment_version?: number | null
          flavor_notes?: string | null
          heat_level?: string | null
          historical_notes?: string | null
          id?: string
          origin?: string | null
          pepper_id?: string
          scoville_max?: number | null
          scoville_min?: number | null
          source_citations?: Json | null
          trade_route?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      pepper_research: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          metadata: Json | null
          pepper_id: string
          query: string
          raw_content: string | null
          source_type: string
          urls: Json | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          pepper_id: string
          query: string
          raw_content?: string | null
          source_type: string
          urls?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          pepper_id?: string
          query?: string
          raw_content?: string | null
          source_type?: string
          urls?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          last_sign_in_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
          last_sign_in_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          last_sign_in_at?: string | null
        }
        Relationships: []
      }
      user_gallery_orders: {
        Row: {
          id: string
          image_order: string[]
          pepper_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          image_order: string[]
          pepper_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          image_order?: string[]
          pepper_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_uploaded_images: {
        Row: {
          created_at: string | null
          filename: string
          id: string
          pepper_id: string
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filename: string
          id?: string
          pepper_id: string
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          filename?: string
          id?: string
          pepper_id?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      user_wishlists: {
        Row: {
          created_at: string
          id: string
          product_handle: string
          product_id: string
          product_image_url: string | null
          product_price: string | null
          product_title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_handle: string
          product_id: string
          product_image_url?: string | null
          product_price?: string | null
          product_title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_handle?: string
          product_id?: string
          product_image_url?: string | null
          product_price?: string | null
          product_title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
