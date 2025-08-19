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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      assistance_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          id: string
          request_type: string
          requester_id: string
          status: string | null
          subject_id: string | null
          title: string
          updated_at: string
          urgency_level: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          id?: string
          request_type: string
          requester_id: string
          status?: string | null
          subject_id?: string | null
          title: string
          updated_at?: string
          urgency_level?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          id?: string
          request_type?: string
          requester_id?: string
          status?: string | null
          subject_id?: string | null
          title?: string
          updated_at?: string
          urgency_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assistance_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assistance_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assistance_requests_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_rate_limits: {
        Row: {
          attempts: number
          blocked_until: string | null
          email: string | null
          id: string
          ip_address: unknown
          last_attempt: string
        }
        Insert: {
          attempts?: number
          blocked_until?: string | null
          email?: string | null
          id?: string
          ip_address: unknown
          last_attempt?: string
        }
        Update: {
          attempts?: number
          blocked_until?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown
          last_attempt?: string
        }
        Relationships: []
      }
      career_consultants: {
        Row: {
          availability: string | null
          created_at: string
          experience_years: number
          hourly_rate: number | null
          id: string
          is_verified: boolean | null
          profile_id: string
          rating: number | null
          specialization: string
          total_sessions: number | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          experience_years?: number
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean | null
          profile_id: string
          rating?: number | null
          specialization: string
          total_sessions?: number | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          experience_years?: number
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean | null
          profile_id?: string
          rating?: number | null
          specialization?: string
          total_sessions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "career_consultants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      career_sessions: {
        Row: {
          client_id: string
          consultant_id: string
          created_at: string
          duration_minutes: number
          feedback: string | null
          id: string
          meeting_link: string | null
          notes: string | null
          rating: number | null
          session_date: string
          session_type: string
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          consultant_id: string
          created_at?: string
          duration_minutes?: number
          feedback?: string | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          rating?: number | null
          session_date: string
          session_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          consultant_id?: string
          created_at?: string
          duration_minutes?: number
          feedback?: string | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          rating?: number | null
          session_date?: string
          session_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_sessions_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "career_consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          downvotes: number | null
          id: string
          is_pinned: boolean | null
          post_type: string
          tags: string[] | null
          title: string
          updated_at: string
          upvotes: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_pinned?: boolean | null
          post_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          upvotes?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_pinned?: boolean | null
          post_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completion_date: string | null
          course_id: string
          enrollment_date: string
          id: string
          progress_percentage: number | null
          rating: number | null
          review: string | null
          student_id: string
        }
        Insert: {
          completion_date?: string | null
          course_id: string
          enrollment_date?: string
          id?: string
          progress_percentage?: number | null
          rating?: number | null
          review?: string | null
          student_id: string
        }
        Update: {
          completion_date?: string | null
          course_id?: string
          enrollment_date?: string
          id?: string
          progress_percentage?: number | null
          rating?: number | null
          review?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          difficulty_level: string
          duration_hours: number
          id: string
          instructor_id: string
          is_published: boolean | null
          price: number | null
          rating: number | null
          skill_id: string
          title: string
          total_enrollments: number | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty_level: string
          duration_hours?: number
          id?: string
          instructor_id: string
          is_published?: boolean | null
          price?: number | null
          rating?: number | null
          skill_id: string
          title: string
          total_enrollments?: number | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string
          duration_hours?: number
          id?: string
          instructor_id?: string
          is_published?: boolean | null
          price?: number | null
          rating?: number | null
          skill_id?: string
          title?: string
          total_enrollments?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          attendance_status: string | null
          event_id: string
          id: string
          participant_id: string
          registration_date: string
        }
        Insert: {
          attendance_status?: string | null
          event_id: string
          id?: string
          participant_id: string
          registration_date?: string
        }
        Update: {
          attendance_status?: string | null
          event_id?: string
          id?: string
          participant_id?: string
          registration_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          current_participants: number | null
          description: string | null
          end_date: string | null
          event_date: string
          event_type: string
          id: string
          is_public: boolean | null
          location: string | null
          max_participants: number | null
          meeting_link: string | null
          organizer_id: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          event_date: string
          event_type?: string
          id?: string
          is_public?: boolean | null
          location?: string | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          event_date?: string
          event_type?: string
          id?: string
          is_public?: boolean | null
          location?: string | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          availability: string | null
          created_at: string
          experience_years: number
          hourly_rate: number | null
          id: string
          is_verified: boolean | null
          profile_id: string
          rating: number | null
          subject_id: string
          total_sessions: number | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          experience_years?: number
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean | null
          profile_id: string
          rating?: number | null
          subject_id: string
          total_sessions?: number | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          experience_years?: number
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean | null
          profile_id?: string
          rating?: number | null
          subject_id?: string
          total_sessions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mentors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentors_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          feedback: string | null
          id: string
          meeting_link: string | null
          mentor_id: string
          notes: string | null
          rating: number | null
          session_date: string
          session_type: string
          status: string
          student_id: string
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          feedback?: string | null
          id?: string
          meeting_link?: string | null
          mentor_id: string
          notes?: string | null
          rating?: number | null
          session_date: string
          session_type?: string
          status?: string
          student_id: string
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          feedback?: string | null
          id?: string
          meeting_link?: string | null
          mentor_id?: string
          notes?: string | null
          rating?: number | null
          session_date?: string
          session_type?: string
          status?: string
          student_id?: string
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_sessions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          downvotes: number | null
          id: string
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          upvotes: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          upvotes?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          field_of_study: string | null
          full_name: string
          id: string
          institution: string | null
          linkedin_url: string | null
          phone: string | null
          updated_at: string
          user_id: string
          user_type: string
          year_of_study: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          field_of_study?: string | null
          full_name: string
          id?: string
          institution?: string | null
          linkedin_url?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          user_type: string
          year_of_study?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          field_of_study?: string | null
          full_name?: string
          id?: string
          institution?: string | null
          linkedin_url?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string
          year_of_study?: number | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          downloads: number | null
          external_url: string | null
          file_url: string | null
          id: string
          is_public: boolean | null
          rating: number | null
          resource_type: string
          subject_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          downloads?: number | null
          external_url?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          rating?: number | null
          resource_type: string
          subject_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          downloads?: number | null
          external_url?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          rating?: number | null
          resource_type?: string
          subject_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          is_public: boolean | null
          rating: number
          review_text: string | null
          reviewee_id: string
          reviewer_id: string
          service_type: string
          session_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          rating: number
          review_text?: string | null
          reviewee_id: string
          reviewer_id: string
          service_type: string
          session_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          rating?: number
          review_text?: string | null
          reviewee_id?: string
          reviewer_id?: string
          service_type?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          difficulty_level: string
          id: string
          name: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          difficulty_level: string
          id?: string
          name: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          difficulty_level?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      study_group_members: {
        Row: {
          group_id: string
          id: string
          join_date: string
          member_id: string
          role: string | null
        }
        Insert: {
          group_id: string
          id?: string
          join_date?: string
          member_id: string
          role?: string | null
        }
        Update: {
          group_id?: string
          id?: string
          join_date?: string
          member_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_group_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          created_at: string
          creator_id: string
          current_members: number | null
          description: string | null
          id: string
          is_public: boolean | null
          max_members: number | null
          meeting_link: string | null
          meeting_schedule: string | null
          name: string
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          current_members?: number | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          max_members?: number | null
          meeting_link?: string | null
          meeting_schedule?: string | null
          name: string
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          current_members?: number | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          max_members?: number | null
          meeting_link?: string | null
          meeting_schedule?: string | null
          name?: string
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_groups_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_groups_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
