export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor: string | null
          created_at: string
          diff: Json | null
          entity: string
          entity_id: string | null
          id: number
        }
        Insert: {
          action: string
          actor?: string | null
          created_at?: string
          diff?: Json | null
          entity: string
          entity_id?: string | null
          id?: never
        }
        Update: {
          action?: string
          actor?: string | null
          created_at?: string
          diff?: Json | null
          entity?: string
          entity_id?: string | null
          id?: never
        }
        Relationships: []
      }
      change_requests: {
        Row: {
          created_at: string
          created_by: string
          decided_at: string | null
          details: string | null
          id: string
          priority: Database["public"]["Enums"]["cr_priority"]
          project_id: string
          quote_days: number | null
          quote_minor: number | null
          status: Database["public"]["Enums"]["cr_status"]
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          decided_at?: string | null
          details?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["cr_priority"]
          project_id: string
          quote_days?: number | null
          quote_minor?: number | null
          status?: Database["public"]["Enums"]["cr_status"]
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          decided_at?: string | null
          details?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["cr_priority"]
          project_id?: string
          quote_days?: number | null
          quote_minor?: number | null
          status?: Database["public"]["Enums"]["cr_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "change_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_members: {
        Row: {
          client_id: string
          profile_id: string
        }
        Insert: {
          client_id: string
          profile_id: string
        }
        Update: {
          client_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_members_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notes: {
        Row: {
          client_id: string
          notes: string
          updated_at: string
        }
        Insert: {
          client_id: string
          notes?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          notes?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          billing_email: string
          country: string
          created_at: string
          gstin: string | null
          id: string
          industry: string
          legal_name: string | null
          name: string
          offboarded_at: string | null
          phone: string | null
          state_code: string | null
          status: Database["public"]["Enums"]["account_status"]
        }
        Insert: {
          address?: string | null
          billing_email: string
          country?: string
          created_at?: string
          gstin?: string | null
          id?: string
          industry: string
          legal_name?: string | null
          name: string
          offboarded_at?: string | null
          phone?: string | null
          state_code?: string | null
          status?: Database["public"]["Enums"]["account_status"]
        }
        Update: {
          address?: string | null
          billing_email?: string
          country?: string
          created_at?: string
          gstin?: string | null
          id?: string
          industry?: string
          legal_name?: string | null
          name?: string
          offboarded_at?: string | null
          phone?: string | null
          state_code?: string | null
          status?: Database["public"]["Enums"]["account_status"]
        }
        Relationships: []
      }
      files: {
        Row: {
          created_at: string
          expires_at: string | null
          file_name: string
          id: string
          kind: Database["public"]["Enums"]["file_kind"]
          project_id: string
          size_bytes: number
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          file_name: string
          id?: string
          kind: Database["public"]["Enums"]["file_kind"]
          project_id: string
          size_bytes: number
          storage_path: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          file_name?: string
          id?: string
          kind?: Database["public"]["Enums"]["file_kind"]
          project_id?: string
          size_bytes?: number
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_counters: {
        Row: {
          fy: string
          last_no: number
        }
        Insert: {
          fy: string
          last_no: number
        }
        Update: {
          fy?: string
          last_no?: number
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount_minor: number | null
          description: string
          id: string
          invoice_id: string
          position: number
          qty: number
          unit_price_minor: number
        }
        Insert: {
          amount_minor?: number | null
          description: string
          id?: string
          invoice_id: string
          position?: number
          qty?: number
          unit_price_minor: number
        }
        Update: {
          amount_minor?: number | null
          description?: string
          id?: string
          invoice_id?: string
          position?: number
          qty?: number
          unit_price_minor?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          bill_to: Json | null
          client_id: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          issue_date: string | null
          number: string | null
          paid_at: string | null
          paid_minor: number
          pdf_path: string | null
          project_id: string | null
          razorpay_link_id: string | null
          razorpay_short_url: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          supply: Database["public"]["Enums"]["supply_type"]
          title: string
          total_minor: number
          voided_at: string | null
        }
        Insert: {
          bill_to?: Json | null
          client_id: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          issue_date?: string | null
          number?: string | null
          paid_at?: string | null
          paid_minor?: number
          pdf_path?: string | null
          project_id?: string | null
          razorpay_link_id?: string | null
          razorpay_short_url?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          supply?: Database["public"]["Enums"]["supply_type"]
          title: string
          total_minor?: number
          voided_at?: string | null
        }
        Update: {
          bill_to?: Json | null
          client_id?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          issue_date?: string | null
          number?: string | null
          paid_at?: string | null
          paid_minor?: number
          pdf_path?: string | null
          project_id?: string | null
          razorpay_link_id?: string | null
          razorpay_short_url?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          supply?: Database["public"]["Enums"]["supply_type"]
          title?: string
          total_minor?: number
          voided_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          client_id: string | null
          company: string | null
          conflict_flag: boolean
          created_at: string
          email: string
          first_reply_at: string | null
          id: string
          industry: string
          ip_hash: string | null
          message: string | null
          name: string
          need: Database["public"]["Enums"]["offer_id"] | null
          next_action_at: string | null
          override_reason: string | null
          razorpay_payment_id: string | null
          repo_url: string | null
          source: string
          stage: Database["public"]["Enums"]["lead_stage"]
          value_minor: number | null
        }
        Insert: {
          client_id?: string | null
          company?: string | null
          conflict_flag?: boolean
          created_at?: string
          email: string
          first_reply_at?: string | null
          id?: string
          industry: string
          ip_hash?: string | null
          message?: string | null
          name: string
          need?: Database["public"]["Enums"]["offer_id"] | null
          next_action_at?: string | null
          override_reason?: string | null
          razorpay_payment_id?: string | null
          repo_url?: string | null
          source?: string
          stage?: Database["public"]["Enums"]["lead_stage"]
          value_minor?: number | null
        }
        Update: {
          client_id?: string | null
          company?: string | null
          conflict_flag?: boolean
          created_at?: string
          email?: string
          first_reply_at?: string | null
          id?: string
          industry?: string
          ip_hash?: string | null
          message?: string | null
          name?: string
          need?: Database["public"]["Enums"]["offer_id"] | null
          next_action_at?: string | null
          override_reason?: string | null
          razorpay_payment_id?: string | null
          repo_url?: string | null
          source?: string
          stage?: Database["public"]["Enums"]["lead_stage"]
          value_minor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          description: string | null
          done_at: string | null
          due_date: string | null
          id: string
          position: number
          project_id: string
          status: Database["public"]["Enums"]["milestone_status"]
          title: string
        }
        Insert: {
          description?: string | null
          done_at?: string | null
          due_date?: string | null
          id?: string
          position: number
          project_id: string
          status?: Database["public"]["Enums"]["milestone_status"]
          title: string
        }
        Update: {
          description?: string | null
          done_at?: string | null
          due_date?: string | null
          id?: string
          position?: number
          project_id?: string
          status?: Database["public"]["Enums"]["milestone_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_minor: number
          created_at: string
          currency: string
          fee_minor: number
          id: string
          invoice_id: string | null
          kind: Database["public"]["Enums"]["payment_kind"]
          lead_id: string | null
          method: string | null
          paid_at: string
          raw: Json | null
          razorpay_payment_id: string | null
          reference: string | null
          source: Database["public"]["Enums"]["payment_source"]
          tax_on_fee_minor: number
        }
        Insert: {
          amount_minor: number
          created_at?: string
          currency?: string
          fee_minor?: number
          id?: string
          invoice_id?: string | null
          kind?: Database["public"]["Enums"]["payment_kind"]
          lead_id?: string | null
          method?: string | null
          paid_at: string
          raw?: Json | null
          razorpay_payment_id?: string | null
          reference?: string | null
          source: Database["public"]["Enums"]["payment_source"]
          tax_on_fee_minor?: number
        }
        Update: {
          amount_minor?: number
          created_at?: string
          currency?: string
          fee_minor?: number
          id?: string
          invoice_id?: string | null
          kind?: Database["public"]["Enums"]["payment_kind"]
          lead_id?: string | null
          method?: string | null
          paid_at?: string
          raw?: Json | null
          razorpay_payment_id?: string | null
          reference?: string | null
          source?: Database["public"]["Enums"]["payment_source"]
          tax_on_fee_minor?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["account_status"]
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["account_status"]
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["account_status"]
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_id: string
          created_at: string
          due_date: string | null
          hours_budget: number | null
          id: string
          offer: Database["public"]["Enums"]["offer_id"]
          progress_override: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          value_minor: number
        }
        Insert: {
          client_id: string
          created_at?: string
          due_date?: string | null
          hours_budget?: number | null
          id?: string
          offer: Database["public"]["Enums"]["offer_id"]
          progress_override?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          value_minor: number
        }
        Update: {
          client_id?: string
          created_at?: string
          due_date?: string | null
          hours_budget?: number | null
          id?: string
          offer?: Database["public"]["Enums"]["offer_id"]
          progress_override?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          value_minor?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      updates: {
        Row: {
          author_id: string | null
          body: string
          client_visible: boolean
          created_at: string
          id: string
          milestone_id: string | null
          needs_client_action: boolean
          project_id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          client_visible?: boolean
          created_at?: string
          id?: string
          milestone_id?: string | null
          needs_client_action?: boolean
          project_id: string
        }
        Update: {
          author_id?: string | null
          body?: string
          client_visible?: boolean
          created_at?: string
          id?: string
          milestone_id?: string | null
          needs_client_action?: boolean
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "updates_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "updates_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      client_payments: {
        Row: {
          amount_minor: number | null
          currency: string | null
          id: string | null
          invoice_id: string | null
          method: string | null
          paid_at: string | null
          reference: string | null
          source: Database["public"]["Enums"]["payment_source"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      project_progress: {
        Row: {
          progress: number | null
          project_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      decide_change_request: {
        Args: { p_approve: boolean; p_id: string }
        Returns: undefined
      }
      fy_label: { Args: { d: string }; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      my_client_ids: { Args: never; Returns: string[] }
      send_invoice: { Args: { p_id: string }; Returns: string }
      uploaded_by_me: { Args: { p_path: string }; Returns: boolean }
    }
    Enums: {
      account_status: "active" | "offboarded"
      cr_priority: "nice" | "sprint" | "urgent"
      cr_status: "open" | "quoted" | "approved" | "declined" | "done"
      file_kind:
        | "build"
        | "report"
        | "proposal"
        | "invoice"
        | "client_upload"
        | "other"
      invoice_status: "draft" | "sent" | "partially_paid" | "paid" | "void"
      lead_stage:
        | "new"
        | "contacted"
        | "call_booked"
        | "proposal_sent"
        | "won"
        | "lost"
        | "declined_auto"
      milestone_status: "todo" | "active" | "done"
      offer_id: "audit" | "sprint" | "retainer" | "mvp" | "website" | "custom"
      payment_kind: "invoice" | "audit_page"
      payment_source: "razorpay" | "bank_transfer" | "upi" | "wise" | "other"
      project_status: "booked" | "active" | "on_hold" | "done" | "cancelled"
      supply_type:
        | "non_gst"
        | "intra_state"
        | "inter_state"
        | "export_lut"
        | "export_igst"
      user_role: "admin" | "client"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      account_status: ["active", "offboarded"],
      cr_priority: ["nice", "sprint", "urgent"],
      cr_status: ["open", "quoted", "approved", "declined", "done"],
      file_kind: [
        "build",
        "report",
        "proposal",
        "invoice",
        "client_upload",
        "other",
      ],
      invoice_status: ["draft", "sent", "partially_paid", "paid", "void"],
      lead_stage: [
        "new",
        "contacted",
        "call_booked",
        "proposal_sent",
        "won",
        "lost",
        "declined_auto",
      ],
      milestone_status: ["todo", "active", "done"],
      offer_id: ["audit", "sprint", "retainer", "mvp", "website", "custom"],
      payment_kind: ["invoice", "audit_page"],
      payment_source: ["razorpay", "bank_transfer", "upi", "wise", "other"],
      project_status: ["booked", "active", "on_hold", "done", "cancelled"],
      supply_type: [
        "non_gst",
        "intra_state",
        "inter_state",
        "export_lut",
        "export_igst",
      ],
      user_role: ["admin", "client"],
    },
  },
} as const

