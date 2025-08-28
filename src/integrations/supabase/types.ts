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
      bookings: {
        Row: {
          agenda: string
          created_at: string
          dados_formulario: Json | null
          estudante_id: string
          id: string
          service_id: string
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          agenda: string
          created_at?: string
          dados_formulario?: Json | null
          estudante_id: string
          id?: string
          service_id: string
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          agenda?: string
          created_at?: string
          dados_formulario?: Json | null
          estudante_id?: string
          id?: string
          service_id?: string
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookings_estudante_id_fkey"
            columns: ["estudante_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
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
      communities: {
        Row: {
          canal: string | null
          created_at: string
          criador_id: string | null
          descricao: string | null
          id: string
          membros_count: number | null
          nome: string
          tema: string
          tipo: string | null
          updated_at: string
        }
        Insert: {
          canal?: string | null
          created_at?: string
          criador_id?: string | null
          descricao?: string | null
          id?: string
          membros_count?: number | null
          nome: string
          tema: string
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          canal?: string | null
          created_at?: string
          criador_id?: string | null
          descricao?: string | null
          id?: string
          membros_count?: number | null
          nome?: string
          tema?: string
          tipo?: string | null
          updated_at?: string
        }
        Relationships: []
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
      cv_reviews: {
        Row: {
          arquivo_url: string | null
          created_at: string
          id: string
          score_ats: number | null
          status: string
          sugestoes: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          arquivo_url?: string | null
          created_at?: string
          id?: string
          score_ats?: number | null
          status?: string
          sugestoes?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          arquivo_url?: string | null
          created_at?: string
          id?: string
          score_ats?: number | null
          status?: string
          sugestoes?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      oer_resources: {
        Row: {
          autor: string | null
          created_at: string
          disciplina: string
          downloads: number | null
          id: string
          licenca: string | null
          nivel: string
          rating: number | null
          tags: string[] | null
          tipo: string
          titulo: string
          updated_at: string
          url: string | null
        }
        Insert: {
          autor?: string | null
          created_at?: string
          disciplina: string
          downloads?: number | null
          id?: string
          licenca?: string | null
          nivel: string
          rating?: number | null
          tags?: string[] | null
          tipo: string
          titulo: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          autor?: string | null
          created_at?: string
          disciplina?: string
          downloads?: number | null
          id?: string
          licenca?: string | null
          nivel?: string
          rating?: number | null
          tags?: string[] | null
          tipo?: string
          titulo?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      partnerships: {
        Row: {
          contato_destino: string | null
          contato_origem: string | null
          created_at: string
          detalhes: Json | null
          documento_mou_url: string | null
          id: string
          instituicao_destino: string
          instituicao_origem: string
          status: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          contato_destino?: string | null
          contato_origem?: string | null
          created_at?: string
          detalhes?: Json | null
          documento_mou_url?: string | null
          id?: string
          instituicao_destino: string
          instituicao_origem: string
          status?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          contato_destino?: string | null
          contato_origem?: string | null
          created_at?: string
          detalhes?: Json | null
          documento_mou_url?: string | null
          id?: string
          instituicao_destino?: string
          instituicao_origem?: string
          status?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: []
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
      pro_assessments: {
        Row: {
          created_at: string
          id: string
          score: number
          skill_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          score: number
          skill_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          score?: number
          skill_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pro_assessments_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "pro_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      pro_bookings: {
        Row: {
          agenda: string
          created_at: string
          dados_formulario: Json | null
          id: string
          service_id: string | null
          status: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          agenda: string
          created_at?: string
          dados_formulario?: Json | null
          id?: string
          service_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          agenda?: string
          created_at?: string
          dados_formulario?: Json | null
          id?: string
          service_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pro_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "pro_services"
            referencedColumns: ["id"]
          },
        ]
      }
      pro_courses: {
        Row: {
          carga_horaria: number
          certificado: boolean | null
          created_at: string
          datas: string[] | null
          id: string
          instrutor_id: string | null
          modalidade: string
          preco: number | null
          titulo: string
          trilha: string
          updated_at: string
        }
        Insert: {
          carga_horaria: number
          certificado?: boolean | null
          created_at?: string
          datas?: string[] | null
          id?: string
          instrutor_id?: string | null
          modalidade: string
          preco?: number | null
          titulo: string
          trilha: string
          updated_at?: string
        }
        Update: {
          carga_horaria?: number
          certificado?: boolean | null
          created_at?: string
          datas?: string[] | null
          id?: string
          instrutor_id?: string | null
          modalidade?: string
          preco?: number | null
          titulo?: string
          trilha?: string
          updated_at?: string
        }
        Relationships: []
      }
      pro_events: {
        Row: {
          created_at: string
          data: string
          descricao: string | null
          id: string
          local_plataforma: string | null
          nome: string
          preco: number | null
          tipo: string
          updated_at: string
          vagas: number | null
          vagas_ocupadas: number | null
        }
        Insert: {
          created_at?: string
          data: string
          descricao?: string | null
          id?: string
          local_plataforma?: string | null
          nome: string
          preco?: number | null
          tipo: string
          updated_at?: string
          vagas?: number | null
          vagas_ocupadas?: number | null
        }
        Update: {
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          local_plataforma?: string | null
          nome?: string
          preco?: number | null
          tipo?: string
          updated_at?: string
          vagas?: number | null
          vagas_ocupadas?: number | null
        }
        Relationships: []
      }
      pro_mentors: {
        Row: {
          areas: string[] | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          experiencia_anos: number
          hourly_rate: number | null
          id: string
          nome: string
          rating: number | null
          slots: Json | null
          updated_at: string
        }
        Insert: {
          areas?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experiencia_anos?: number
          hourly_rate?: number | null
          id?: string
          nome: string
          rating?: number | null
          slots?: Json | null
          updated_at?: string
        }
        Update: {
          areas?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experiencia_anos?: number
          hourly_rate?: number | null
          id?: string
          nome?: string
          rating?: number | null
          slots?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      pro_opportunities: {
        Row: {
          created_at: string
          empresa: string
          id: string
          is_active: boolean | null
          link: string | null
          local: string | null
          requisitos: string[] | null
          salario_max: number | null
          salario_min: number | null
          senioridade: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa: string
          id?: string
          is_active?: boolean | null
          link?: string | null
          local?: string | null
          requisitos?: string[] | null
          salario_max?: number | null
          salario_min?: number | null
          senioridade: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa?: string
          id?: string
          is_active?: boolean | null
          link?: string | null
          local?: string | null
          requisitos?: string[] | null
          salario_max?: number | null
          salario_min?: number | null
          senioridade?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      pro_services: {
        Row: {
          created_at: string
          descricao: string | null
          formatos: string[] | null
          id: string
          nome: string
          preco_base: number
          sla_horas: number
          slug: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          formatos?: string[] | null
          id?: string
          nome: string
          preco_base: number
          sla_horas: number
          slug: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          formatos?: string[] | null
          id?: string
          nome?: string
          preco_base?: number
          sla_horas?: number
          slug?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      pro_skills: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nivel_recomendado: string
          nome: string
          trilha: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nivel_recomendado: string
          nome: string
          trilha: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nivel_recomendado?: string
          nome?: string
          trilha?: string
        }
        Relationships: []
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
      scholarship_opportunities: {
        Row: {
          created_at: string
          descricao: string | null
          grau: string
          id: string
          is_active: boolean | null
          link: string | null
          nome: string
          pais: string
          prazo: string | null
          requisitos: Json | null
          updated_at: string
          valor_bolsa: number | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          grau: string
          id?: string
          is_active?: boolean | null
          link?: string | null
          nome: string
          pais: string
          prazo?: string | null
          requisitos?: Json | null
          updated_at?: string
          valor_bolsa?: number | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          grau?: string
          id?: string
          is_active?: boolean | null
          link?: string | null
          nome?: string
          pais?: string
          prazo?: string | null
          requisitos?: Json | null
          updated_at?: string
          valor_bolsa?: number | null
        }
        Relationships: []
      }
      service_mentors: {
        Row: {
          areas: string[] | null
          created_at: string
          id: string
          is_active: boolean | null
          nome: string
          profile_id: string
          rating: number | null
          slots: Json | null
          updated_at: string
        }
        Insert: {
          areas?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          nome: string
          profile_id: string
          rating?: number | null
          slots?: Json | null
          updated_at?: string
        }
        Update: {
          areas?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          nome?: string
          profile_id?: string
          rating?: number | null
          slots?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_mentors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          descricao: string | null
          formatos: string[] | null
          id: string
          nome: string
          preco_base: number
          sla_horas: number
          slug: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          formatos?: string[] | null
          id?: string
          nome: string
          preco_base: number
          sla_horas: number
          slug: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          formatos?: string[] | null
          id?: string
          nome?: string
          preco_base?: number
          sla_horas?: number
          slug?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
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
      student_goals: {
        Row: {
          created_at: string
          estudante_id: string
          id: string
          meta: string
          prazo: string | null
          progresso_percent: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          estudante_id: string
          id?: string
          meta: string
          prazo?: string | null
          progresso_percent?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          estudante_id?: string
          id?: string
          meta?: string
          prazo?: string | null
          progresso_percent?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_goals_estudante_id_fkey"
            columns: ["estudante_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      study_materials: {
        Row: {
          content: Json | null
          created_at: string
          creator_id: string | null
          disciplina: string
          id: string
          is_public: boolean | null
          tags: string[] | null
          tipo: string
          titulo: string
          updated_at: string
          url: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          creator_id?: string | null
          disciplina: string
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          tipo: string
          titulo: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          creator_id?: string | null
          disciplina?: string
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          tipo?: string
          titulo?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_materials_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      support_tickets: {
        Row: {
          assunto: string
          atribuido_a: string | null
          created_at: string
          descricao: string | null
          id: string
          plataforma: string | null
          professor_id: string
          resposta: string | null
          severidade: string | null
          sla: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assunto: string
          atribuido_a?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          plataforma?: string | null
          professor_id: string
          resposta?: string | null
          severidade?: string | null
          sla?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assunto?: string
          atribuido_a?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          plataforma?: string | null
          professor_id?: string
          resposta?: string | null
          severidade?: string | null
          sla?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      teacher_services: {
        Row: {
          created_at: string
          descricao: string | null
          formatos: string[] | null
          id: string
          nome: string
          preco_base: number
          sla_horas: number
          slug: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          formatos?: string[] | null
          id?: string
          nome: string
          preco_base: number
          sla_horas: number
          slug: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          formatos?: string[] | null
          id?: string
          nome?: string
          preco_base?: number
          sla_horas?: number
          slug?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      trainings: {
        Row: {
          carga_horaria: number
          certificacao_cpd: boolean | null
          created_at: string
          datas: string[] | null
          descricao: string | null
          id: string
          instrutor_id: string | null
          modalidade: string
          preco: number | null
          status: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          carga_horaria: number
          certificacao_cpd?: boolean | null
          created_at?: string
          datas?: string[] | null
          descricao?: string | null
          id?: string
          instrutor_id?: string | null
          modalidade: string
          preco?: number | null
          status?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          carga_horaria?: number
          certificacao_cpd?: boolean | null
          created_at?: string
          datas?: string[] | null
          descricao?: string | null
          id?: string
          instrutor_id?: string | null
          modalidade?: string
          preco?: number | null
          status?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_dashboard_stats: {
        Row: {
          average_rating: number | null
          completed_bookings: number | null
          courses_completed: number | null
          courses_enrolled: number | null
          id: string
          last_activity: string | null
          pending_bookings: number | null
          reviews_received: number | null
          total_bookings: number | null
          total_earned: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_rating?: number | null
          completed_bookings?: number | null
          courses_completed?: number | null
          courses_enrolled?: number | null
          id?: string
          last_activity?: string | null
          pending_bookings?: number | null
          reviews_received?: number | null
          total_bookings?: number | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_rating?: number | null
          completed_bookings?: number | null
          courses_completed?: number | null
          courses_enrolled?: number | null
          id?: string
          last_activity?: string | null
          pending_bookings?: number | null
          reviews_received?: number | null
          total_bookings?: number | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_unread_notification_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
      mark_notification_read: {
        Args: { notification_id: string }
        Returns: undefined
      }
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
