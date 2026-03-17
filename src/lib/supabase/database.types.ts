export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          role: 'admin' | 'manager' | 'member'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          role?: 'admin' | 'manager' | 'member'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          role?: 'admin' | 'manager' | 'member'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          color: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          category?: string
          created_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          name: string
          type: Database['public']['Enums']['company_type']
          website: string | null
          linkedin_url: string | null
          country: string | null
          region: Database['public']['Enums']['company_region']
          size: Database['public']['Enums']['company_size'] | null
          is_member: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: Database['public']['Enums']['company_type']
          website?: string | null
          linkedin_url?: string | null
          country?: string | null
          region?: Database['public']['Enums']['company_region']
          size?: Database['public']['Enums']['company_size'] | null
          is_member?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: Database['public']['Enums']['company_type']
          website?: string | null
          linkedin_url?: string | null
          country?: string | null
          region?: Database['public']['Enums']['company_region']
          size?: Database['public']['Enums']['company_size'] | null
          is_member?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          linkedin_url: string | null
          title: string | null
          company_id: string | null
          category: Database['public']['Enums']['contact_category']
          lead_score: number
          lead_tier: Database['public']['Enums']['lead_tier']
          next_follow_up_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          title?: string | null
          company_id?: string | null
          category?: Database['public']['Enums']['contact_category']
          lead_score?: number
          lead_tier?: Database['public']['Enums']['lead_tier']
          next_follow_up_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          title?: string | null
          company_id?: string | null
          category?: Database['public']['Enums']['contact_category']
          lead_score?: number
          lead_tier?: Database['public']['Enums']['lead_tier']
          next_follow_up_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contacts_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          }
        ]
      }
      contact_tags: {
        Row: {
          contact_id: string
          tag_id: string
        }
        Insert: {
          contact_id: string
          tag_id: string
        }
        Update: {
          contact_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contact_tags_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'contact_tags_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          }
        ]
      }
      company_tags: {
        Row: {
          company_id: string
          tag_id: string
        }
        Insert: {
          company_id: string
          tag_id: string
        }
        Update: {
          company_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'company_tags_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'company_tags_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          }
        ]
      }
      interactions: {
        Row: {
          id: string
          contact_id: string | null
          company_id: string | null
          deal_id: string | null
          type: Database['public']['Enums']['interaction_type']
          direction: Database['public']['Enums']['interaction_direction'] | null
          subject: string | null
          content: string | null
          outcome: string | null
          occurred_at: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          contact_id?: string | null
          company_id?: string | null
          deal_id?: string | null
          type: Database['public']['Enums']['interaction_type']
          direction?: Database['public']['Enums']['interaction_direction'] | null
          subject?: string | null
          content?: string | null
          outcome?: string | null
          occurred_at?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          contact_id?: string | null
          company_id?: string | null
          deal_id?: string | null
          type?: Database['public']['Enums']['interaction_type']
          direction?: Database['public']['Enums']['interaction_direction'] | null
          subject?: string | null
          content?: string | null
          outcome?: string | null
          occurred_at?: string
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'interactions_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'interactions_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'interactions_deal_id_fkey'
            columns: ['deal_id']
            isOneToOne: false
            referencedRelation: 'deals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'interactions_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      follow_ups: {
        Row: {
          id: string
          contact_id: string | null
          title: string
          due_date: string
          priority: Database['public']['Enums']['follow_up_priority']
          status: Database['public']['Enums']['follow_up_status']
          assigned_to: string | null
          notes: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          contact_id?: string | null
          title: string
          due_date: string
          priority?: Database['public']['Enums']['follow_up_priority']
          status?: Database['public']['Enums']['follow_up_status']
          assigned_to?: string | null
          notes?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          contact_id?: string | null
          title?: string
          due_date?: string
          priority?: Database['public']['Enums']['follow_up_priority']
          status?: Database['public']['Enums']['follow_up_status']
          assigned_to?: string | null
          notes?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'follow_ups_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'follow_ups_assigned_to_fkey'
            columns: ['assigned_to']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      deals: {
        Row: {
          id: string
          title: string
          company_id: string | null
          contact_id: string | null
          stage: Database['public']['Enums']['deal_stage']
          deal_type: Database['public']['Enums']['deal_type']
          value_eur: number | null
          probability: number | null
          expected_close_date: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company_id?: string | null
          contact_id?: string | null
          stage?: Database['public']['Enums']['deal_stage']
          deal_type: Database['public']['Enums']['deal_type']
          value_eur?: number | null
          probability?: number | null
          expected_close_date?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company_id?: string | null
          contact_id?: string | null
          stage?: Database['public']['Enums']['deal_stage']
          deal_type?: Database['public']['Enums']['deal_type']
          value_eur?: number | null
          probability?: number | null
          expected_close_date?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'deals_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'deals_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'deals_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      deal_stage_history: {
        Row: {
          id: string
          deal_id: string
          from_stage: Database['public']['Enums']['deal_stage'] | null
          to_stage: Database['public']['Enums']['deal_stage']
          changed_by: string | null
          changed_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          deal_id: string
          from_stage?: Database['public']['Enums']['deal_stage'] | null
          to_stage: Database['public']['Enums']['deal_stage']
          changed_by?: string | null
          changed_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          deal_id?: string
          from_stage?: Database['public']['Enums']['deal_stage'] | null
          to_stage?: Database['public']['Enums']['deal_stage']
          changed_by?: string | null
          changed_at?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'deal_stage_history_deal_id_fkey'
            columns: ['deal_id']
            isOneToOne: false
            referencedRelation: 'deals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'deal_stage_history_changed_by_fkey'
            columns: ['changed_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      events: {
        Row: {
          id: string
          name: string
          event_type: Database['public']['Enums']['event_type']
          venue: string | null
          description: string | null
          starts_at: string | null
          ends_at: string | null
          max_capacity: number | null
          dress_code: string | null
          status: Database['public']['Enums']['event_status']
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          event_type: Database['public']['Enums']['event_type']
          venue?: string | null
          description?: string | null
          starts_at?: string | null
          ends_at?: string | null
          max_capacity?: number | null
          dress_code?: string | null
          status?: Database['public']['Enums']['event_status']
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          event_type?: Database['public']['Enums']['event_type']
          venue?: string | null
          description?: string | null
          starts_at?: string | null
          ends_at?: string | null
          max_capacity?: number | null
          dress_code?: string | null
          status?: Database['public']['Enums']['event_status']
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'events_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      event_guests: {
        Row: {
          id: string
          event_id: string
          contact_id: string | null
          guest_name: string
          guest_email: string | null
          tier: Database['public']['Enums']['guest_tier']
          table_number: number | null
          dietary_requirements: string | null
          plus_one: boolean
          plus_one_name: string | null
          rsvp_status: Database['public']['Enums']['rsvp_status']
          rsvp_token: string
          invitation_sent_at: string | null
          rsvp_responded_at: string | null
          checked_in: boolean
          checked_in_at: string | null
          qr_code_data: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          contact_id?: string | null
          guest_name: string
          guest_email?: string | null
          tier?: Database['public']['Enums']['guest_tier']
          table_number?: number | null
          dietary_requirements?: string | null
          plus_one?: boolean
          plus_one_name?: string | null
          rsvp_status?: Database['public']['Enums']['rsvp_status']
          rsvp_token?: string
          invitation_sent_at?: string | null
          rsvp_responded_at?: string | null
          checked_in?: boolean
          checked_in_at?: string | null
          qr_code_data?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          contact_id?: string | null
          guest_name?: string
          guest_email?: string | null
          tier?: Database['public']['Enums']['guest_tier']
          table_number?: number | null
          dietary_requirements?: string | null
          plus_one?: boolean
          plus_one_name?: string | null
          rsvp_status?: Database['public']['Enums']['rsvp_status']
          rsvp_token?: string
          invitation_sent_at?: string | null
          rsvp_responded_at?: string | null
          checked_in?: boolean
          checked_in_at?: string | null
          qr_code_data?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'event_guests_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'event_guests_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          }
        ]
      }
      event_sponsors: {
        Row: {
          id: string
          event_id: string
          company_id: string
          sponsor_tier: Database['public']['Enums']['sponsor_tier']
          amount_eur: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          company_id: string
          sponsor_tier: Database['public']['Enums']['sponsor_tier']
          amount_eur?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          company_id?: string
          sponsor_tier?: Database['public']['Enums']['sponsor_tier']
          amount_eur?: number | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'event_sponsors_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'event_sponsors_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          }
        ]
      }
      event_follow_ups: {
        Row: {
          id: string
          event_id: string
          contact_id: string | null
          type: string | null
          notes: string | null
          status: Database['public']['Enums']['follow_up_status']
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          contact_id?: string | null
          type?: string | null
          notes?: string | null
          status?: Database['public']['Enums']['follow_up_status']
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          contact_id?: string | null
          type?: string | null
          notes?: string | null
          status?: Database['public']['Enums']['follow_up_status']
          due_date?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'event_follow_ups_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'event_follow_ups_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          }
        ]
      }
      lead_scoring_rules: {
        Row: {
          id: string
          factor: string
          condition: Json
          points: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          factor: string
          condition: Json
          points: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          factor?: string
          condition?: Json
          points?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      lead_score_history: {
        Row: {
          id: string
          contact_id: string
          old_score: number
          new_score: number
          reason: string | null
          scored_at: string
        }
        Insert: {
          id?: string
          contact_id: string
          old_score: number
          new_score: number
          reason?: string | null
          scored_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          old_score?: number
          new_score?: number
          reason?: string | null
          scored_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'lead_score_history_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      company_type: 'gaming_operator' | 'supplier' | 'association' | 'media' | 'regulator' | 'technology' | 'legal' | 'financial' | 'other'
      company_region: 'bulgaria' | 'balkans' | 'europe' | 'global'
      company_size: 'small' | 'medium' | 'large' | 'enterprise'
      contact_category: 'sponsor' | 'partner' | 'member' | 'media' | 'vip' | 'speaker' | 'government' | 'other'
      lead_tier: 'cold' | 'warm' | 'hot' | 'qualified'
      interaction_type: 'email' | 'call' | 'meeting' | 'linkedin' | 'note' | 'whatsapp'
      interaction_direction: 'inbound' | 'outbound'
      follow_up_priority: 'low' | 'medium' | 'high' | 'critical'
      follow_up_status: 'pending' | 'completed' | 'overdue'
      deal_stage: 'initial_contact' | 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
      deal_type: 'sponsorship' | 'advertising' | 'membership' | 'event' | 'partnership'
      event_type: 'gala_dinner' | 'conference' | 'networking' | 'workshop' | 'awards'
      event_status: 'draft' | 'active' | 'completed' | 'cancelled'
      guest_tier: 'vip' | 'sponsor' | 'speaker' | 'media' | 'partner' | 'member' | 'general'
      rsvp_status: 'pending' | 'confirmed' | 'declined' | 'tentative'
      sponsor_tier: 'title' | 'gold' | 'silver' | 'bronze' | 'media'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'])
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'])
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'])
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database['public']['Enums'])
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions['schema']]['Enums'])
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof (Database['public']['Enums'])
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
