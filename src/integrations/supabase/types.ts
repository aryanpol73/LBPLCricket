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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      fan_leaderboard: {
        Row: {
          correct_predictions: number | null
          created_at: string | null
          id: string
          points: number | null
          total_predictions: number | null
          user_identifier: string
          username: string | null
        }
        Insert: {
          correct_predictions?: number | null
          created_at?: string | null
          id?: string
          points?: number | null
          total_predictions?: number | null
          user_identifier: string
          username?: string | null
        }
        Update: {
          correct_predictions?: number | null
          created_at?: string | null
          id?: string
          points?: number | null
          total_predictions?: number | null
          user_identifier?: string
          username?: string | null
        }
        Relationships: []
      }
      fan_poll_options: {
        Row: {
          id: string
          option_text: string
          poll_id: string
          team_id: string | null
        }
        Insert: {
          id?: string
          option_text: string
          poll_id: string
          team_id?: string | null
        }
        Update: {
          id?: string
          option_text?: string
          poll_id?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fan_poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "fan_polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fan_poll_options_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      fan_poll_votes: {
        Row: {
          created_at: string | null
          id: string
          option_id: string
          poll_id: string
          user_identifier: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_id: string
          poll_id: string
          user_identifier: string
        }
        Update: {
          created_at?: string | null
          id?: string
          option_id?: string
          poll_id?: string
          user_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "fan_poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "fan_poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fan_poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "fan_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      fan_polls: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          question: string
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          question: string
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          question?: string
        }
        Relationships: []
      }
      match_predictions: {
        Row: {
          created_at: string | null
          id: string
          match_id: string
          team_id: string
          user_identifier: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id: string
          team_id: string
          user_identifier: string
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string
          team_id?: string
          user_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_predictions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_predictions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          group_name: string | null
          id: string
          match_date: string
          match_phase: string | null
          player_of_match_id: string | null
          status: string | null
          team_a_id: string
          team_a_score: string | null
          team_b_id: string
          team_b_score: string | null
          venue: string | null
          winner_id: string | null
          youtube_stream_url: string | null
        }
        Insert: {
          created_at?: string | null
          group_name?: string | null
          id?: string
          match_date: string
          match_phase?: string | null
          player_of_match_id?: string | null
          status?: string | null
          team_a_id: string
          team_a_score?: string | null
          team_b_id: string
          team_b_score?: string | null
          venue?: string | null
          winner_id?: string | null
          youtube_stream_url?: string | null
        }
        Update: {
          created_at?: string | null
          group_name?: string | null
          id?: string
          match_date?: string
          match_phase?: string | null
          player_of_match_id?: string | null
          status?: string | null
          team_a_id?: string
          team_a_score?: string | null
          team_b_id?: string
          team_b_score?: string | null
          venue?: string | null
          winner_id?: string | null
          youtube_stream_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_player_of_match_id_fkey"
            columns: ["player_of_match_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          age: number | null
          created_at: string | null
          id: string
          is_key_player: boolean | null
          name: string
          role: string | null
          team_id: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          id?: string
          is_key_player?: boolean | null
          name: string
          role?: string | null
          team_id?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          id?: string
          is_key_player?: boolean | null
          name?: string
          role?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      points_table: {
        Row: {
          id: string
          losses: number | null
          matches_played: number | null
          net_run_rate: number | null
          points: number | null
          team_id: string
          updated_at: string | null
          wins: number | null
        }
        Insert: {
          id?: string
          losses?: number | null
          matches_played?: number | null
          net_run_rate?: number | null
          points?: number | null
          team_id: string
          updated_at?: string | null
          wins?: number | null
        }
        Update: {
          id?: string
          losses?: number | null
          matches_played?: number | null
          net_run_rate?: number | null
          points?: number | null
          team_id?: string
          updated_at?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "points_table_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      potm_votes: {
        Row: {
          created_at: string | null
          id: string
          match_id: string
          player_id: string
          user_identifier: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id: string
          player_id: string
          user_identifier: string
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string
          player_id?: string
          user_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "potm_votes_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "potm_votes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          fun_fact: string | null
          home_city: string | null
          id: string
          logo_url: string | null
          name: string
          short_name: string | null
        }
        Insert: {
          created_at?: string | null
          fun_fact?: string | null
          home_city?: string | null
          id?: string
          logo_url?: string | null
          name: string
          short_name?: string | null
        }
        Update: {
          created_at?: string | null
          fun_fact?: string | null
          home_city?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          short_name?: string | null
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
          role: Database["public"]["Enums"]["app_role"]
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
