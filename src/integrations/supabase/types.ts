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
      app_ratings: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          rating: number
          updated_at: string
          user_identifier: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating: number
          updated_at?: string
          user_identifier: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number
          updated_at?: string
          user_identifier?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string | null
          post_id: string
          user_id: string
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id: string
          user_id: string
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          image_urls: string[] | null
          is_pinned: boolean | null
          post_type: string | null
          updated_at: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_pinned?: boolean | null
          post_type?: string | null
          updated_at?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_pinned?: boolean | null
          post_type?: string | null
          updated_at?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      community_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_otps: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          failed_attempts: number | null
          id: string
          locked_until: string | null
          otp: string
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          failed_attempts?: number | null
          id?: string
          locked_until?: string | null
          otp: string
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          failed_attempts?: number | null
          id?: string
          locked_until?: string | null
          otp?: string
          used?: boolean | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          is_featured: boolean | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          title?: string | null
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
      match_scorecards: {
        Row: {
          created_at: string | null
          id: string
          match_id: string | null
          match_no: number
          result_text: string
          team_a_batting: Json
          team_a_bowling: Json
          team_a_extras: string | null
          team_a_id: string | null
          team_a_name: string
          team_a_overs: string
          team_a_runs: number
          team_a_wickets: number
          team_b_batting: Json
          team_b_bowling: Json
          team_b_extras: string | null
          team_b_id: string | null
          team_b_name: string
          team_b_overs: string
          team_b_runs: number
          team_b_wickets: number
          toss_text: string | null
          winner_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          match_no: number
          result_text: string
          team_a_batting?: Json
          team_a_bowling?: Json
          team_a_extras?: string | null
          team_a_id?: string | null
          team_a_name: string
          team_a_overs: string
          team_a_runs: number
          team_a_wickets: number
          team_b_batting?: Json
          team_b_bowling?: Json
          team_b_extras?: string | null
          team_b_id?: string | null
          team_b_name: string
          team_b_overs: string
          team_b_runs: number
          team_b_wickets: number
          toss_text?: string | null
          winner_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          match_no?: number
          result_text?: string
          team_a_batting?: Json
          team_a_bowling?: Json
          team_a_extras?: string | null
          team_a_id?: string | null
          team_a_name?: string
          team_a_overs?: string
          team_a_runs?: number
          team_a_wickets?: number
          team_b_batting?: Json
          team_b_bowling?: Json
          team_b_extras?: string | null
          team_b_id?: string | null
          team_b_name?: string
          team_b_overs?: string
          team_b_runs?: number
          team_b_wickets?: number
          toss_text?: string | null
          winner_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_scorecards_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_scorecards_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_scorecards_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          cricheroes_match_id: string | null
          group_name: string | null
          id: string
          match_date: string
          match_no: number | null
          match_phase: string | null
          player_of_match_id: string | null
          round_no: number | null
          scorer_link: string | null
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
          cricheroes_match_id?: string | null
          group_name?: string | null
          id?: string
          match_date: string
          match_no?: number | null
          match_phase?: string | null
          player_of_match_id?: string | null
          round_no?: number | null
          scorer_link?: string | null
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
          cricheroes_match_id?: string | null
          group_name?: string | null
          id?: string
          match_date?: string
          match_no?: number | null
          match_phase?: string | null
          player_of_match_id?: string | null
          round_no?: number | null
          scorer_link?: string | null
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
          batting_average: number | null
          bowling_average: number | null
          catches: number | null
          created_at: string | null
          economy_rate: number | null
          id: string
          is_key_player: boolean | null
          matches_played: number | null
          name: string
          role: string | null
          runs_scored: number | null
          strike_rate: number | null
          stumpings: number | null
          team_id: string | null
          wickets_taken: number | null
        }
        Insert: {
          age?: number | null
          batting_average?: number | null
          bowling_average?: number | null
          catches?: number | null
          created_at?: string | null
          economy_rate?: number | null
          id?: string
          is_key_player?: boolean | null
          matches_played?: number | null
          name: string
          role?: string | null
          runs_scored?: number | null
          strike_rate?: number | null
          stumpings?: number | null
          team_id?: string | null
          wickets_taken?: number | null
        }
        Update: {
          age?: number | null
          batting_average?: number | null
          bowling_average?: number | null
          catches?: number | null
          created_at?: string | null
          economy_rate?: number | null
          id?: string
          is_key_player?: boolean | null
          matches_played?: number | null
          name?: string
          role?: string | null
          runs_scored?: number | null
          strike_rate?: number | null
          stumpings?: number | null
          team_id?: string | null
          wickets_taken?: number | null
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
          group_name: string | null
          id: string
          losses: number | null
          matches_played: number | null
          net_run_rate: number | null
          points: number | null
          round: number
          team_id: string
          team_name: string | null
          ties: number | null
          updated_at: string | null
          wins: number | null
        }
        Insert: {
          group_name?: string | null
          id?: string
          losses?: number | null
          matches_played?: number | null
          net_run_rate?: number | null
          points?: number | null
          round?: number
          team_id: string
          team_name?: string | null
          ties?: number | null
          updated_at?: string | null
          wins?: number | null
        }
        Update: {
          group_name?: string | null
          id?: string
          losses?: number | null
          matches_played?: number | null
          net_run_rate?: number | null
          points?: number | null
          round?: number
          team_id?: string
          team_name?: string | null
          ties?: number | null
          updated_at?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "points_table_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
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
      site_stats: {
        Row: {
          display_order: number | null
          id: string
          stat_key: string
          stat_label: string
          stat_value: number
          updated_at: string | null
        }
        Insert: {
          display_order?: number | null
          id?: string
          stat_key: string
          stat_label: string
          stat_value: number
          updated_at?: string | null
        }
        Update: {
          display_order?: number | null
          id?: string
          stat_key?: string
          stat_label?: string
          stat_value?: number
          updated_at?: string | null
        }
        Relationships: []
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
      tournament_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
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
      get_match_prediction_counts: {
        Args: { p_match_id: string }
        Returns: {
          prediction_count: number
          team_id: string
        }[]
      }
      get_potm_vote_counts: {
        Args: { p_match_id: string }
        Returns: {
          player_id: string
          vote_count: number
        }[]
      }
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
