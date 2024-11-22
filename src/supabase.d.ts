export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  portfolio: {
    Tables: {
      attachments: {
        Row: {
          base64: string | null
          bucket: string
          createdAt: string
          filename: string | null
          folder: string
          id: number
          medium: string | null
          mimeType: string | null
          name: string
          src: string
          thumbnail: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          base64?: string | null
          bucket: string
          createdAt?: string
          filename?: string | null
          folder: string
          id?: number
          medium?: string | null
          mimeType?: string | null
          name: string
          src: string
          thumbnail?: string | null
          updatedAt?: string
          userId: string
        }
        Update: {
          base64?: string | null
          bucket?: string
          createdAt?: string
          filename?: string | null
          folder?: string
          id?: number
          medium?: string | null
          mimeType?: string | null
          name?: string
          src?: string
          thumbnail?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          company: string | null
          createdAt: string
          email: string
          id: number
          message: string
          name: string
          updatedAt: string
          userId: string
        }
        Insert: {
          company?: string | null
          createdAt?: string
          email: string
          id?: number
          message: string
          name: string
          updatedAt?: string
          userId: string
        }
        Update: {
          company?: string | null
          createdAt?: string
          email?: string
          id?: number
          message?: string
          name?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          data: Json | null
          educations: Json | null
          experiences: Json | null
          full_name: string
          github: Json | null
          id: string
          resume: Json | null
          updated_at: string
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          data?: Json | null
          educations?: Json | null
          experiences?: Json | null
          full_name: string
          github?: Json | null
          id: string
          resume?: Json | null
          updated_at?: string
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          data?: Json | null
          educations?: Json | null
          experiences?: Json | null
          full_name?: string
          github?: Json | null
          id?: string
          resume?: Json | null
          updated_at?: string
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      project_attachments: {
        Row: {
          attachmentId: number
          id: number
          projectId: string
          sortOrder: number
        }
        Insert: {
          attachmentId: number
          id?: number
          projectId: string
          sortOrder?: number
        }
        Update: {
          attachmentId?: number
          id?: number
          projectId?: string
          sortOrder?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_attachments_attachmentId_fkey"
            columns: ["attachmentId"]
            isOneToOne: false
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_attachments_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_technologies: {
        Row: {
          id: number
          isVisible: boolean
          projectId: string
          sortOrder: number
          technologyId: string
        }
        Insert: {
          id?: number
          isVisible?: boolean
          projectId: string
          sortOrder?: number
          technologyId: string
        }
        Update: {
          id?: number
          isVisible?: boolean
          projectId?: string
          sortOrder?: number
          technologyId?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_technologies_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_technologies_technologyId_fkey"
            columns: ["technologyId"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          name: string
          previewUrl: string | null
          repository: string | null
          repositoryOwner: string | null
          repositoryRepo: string | null
          slug: string
          sortOrder: number
          sourceCodeUrl: string | null
          status: string
          tags: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          name: string
          previewUrl?: string | null
          repository?: string | null
          repositoryOwner?: string | null
          repositoryRepo?: string | null
          slug: string
          sortOrder?: number
          sourceCodeUrl?: string | null
          status?: string
          tags?: string | null
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          name?: string
          previewUrl?: string | null
          repository?: string | null
          repositoryOwner?: string | null
          repositoryRepo?: string | null
          slug?: string
          sortOrder?: number
          sourceCodeUrl?: string | null
          status?: string
          tags?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      technologies: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          url: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon: string
          id: string
          name: string
          url?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          url?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar: string | null
          company: string | null
          createdAt: string
          date: string
          id: number
          name: string
          rating: number
          sortOrder: number
          status: string
          testimonial: string
          updatedAt: string
          userId: string
        }
        Insert: {
          avatar?: string | null
          company?: string | null
          createdAt?: string
          date: string
          id?: number
          name: string
          rating: number
          sortOrder?: number
          status?: string
          testimonial: string
          updatedAt?: string
          userId: string
        }
        Update: {
          avatar?: string | null
          company?: string | null
          createdAt?: string
          date?: string
          id?: number
          name?: string
          rating?: number
          sortOrder?: number
          status?: string
          testimonial?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_technologies: {
        Row: {
          created_at: string
          id: string
          technologyId: string
          userId: string
        }
        Insert: {
          created_at?: string
          id: string
          technologyId: string
          userId: string
        }
        Update: {
          created_at?: string
          id?: string
          technologyId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_technologies_technologyId_fkey"
            columns: ["technologyId"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_technologies_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      addresses: {
        Row: {
          addressLine1: string
          addressLine2: string | null
          cityCorporation: string | null
          cityId: number | null
          countryId: number | null
          districtId: number | null
          divisionId: number | null
          email: string | null
          houseNumber: string | null
          id: number
          name: string | null
          phone: string | null
          postCode: string | null
          postOffice: string | null
          rmo: string | null
          stateId: number | null
          subDistrictId: number | null
          type: Database["public"]["Enums"]["PublicAddressType"]
          union: string | null
          village: string | null
          wardNumber: string | null
        }
        Insert: {
          addressLine1: string
          addressLine2?: string | null
          cityCorporation?: string | null
          cityId?: number | null
          countryId?: number | null
          districtId?: number | null
          divisionId?: number | null
          email?: string | null
          houseNumber?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          postCode?: string | null
          postOffice?: string | null
          rmo?: string | null
          stateId?: number | null
          subDistrictId?: number | null
          type?: Database["public"]["Enums"]["PublicAddressType"]
          union?: string | null
          village?: string | null
          wardNumber?: string | null
        }
        Update: {
          addressLine1?: string
          addressLine2?: string | null
          cityCorporation?: string | null
          cityId?: number | null
          countryId?: number | null
          districtId?: number | null
          divisionId?: number | null
          email?: string | null
          houseNumber?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          postCode?: string | null
          postOffice?: string | null
          rmo?: string | null
          stateId?: number | null
          subDistrictId?: number | null
          type?: Database["public"]["Enums"]["PublicAddressType"]
          union?: string | null
          village?: string | null
          wardNumber?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_cityId_fkey"
            columns: ["cityId"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_countryId_fkey"
            columns: ["countryId"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_districtId_fkey"
            columns: ["districtId"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_divisionId_fkey"
            columns: ["divisionId"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_stateId_fkey"
            columns: ["stateId"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_subDistrictId_fkey"
            columns: ["subDistrictId"]
            isOneToOne: false
            referencedRelation: "sub_districts"
            referencedColumns: ["id"]
          },
        ]
      }
      blood_groups: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          countryId: number | null
          districtId: number | null
          divisionId: number | null
          id: number
          name: string
          stateId: number | null
        }
        Insert: {
          countryId?: number | null
          districtId?: number | null
          divisionId?: number | null
          id?: number
          name: string
          stateId?: number | null
        }
        Update: {
          countryId?: number | null
          districtId?: number | null
          divisionId?: number | null
          id?: number
          name?: string
          stateId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cities_countryId_fkey"
            columns: ["countryId"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cities_districtId_fkey"
            columns: ["districtId"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cities_divisionId_fkey"
            columns: ["divisionId"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cities_stateId_fkey"
            columns: ["stateId"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          id: number
          iso2: string
          iso3: string
          name: string
        }
        Insert: {
          id?: number
          iso2: string
          iso3: string
          name: string
        }
        Update: {
          id?: number
          iso2?: string
          iso3?: string
          name?: string
        }
        Relationships: []
      }
      districts: {
        Row: {
          countryId: number
          divisionId: number
          id: number
          name: string
        }
        Insert: {
          countryId: number
          divisionId: number
          id?: number
          name: string
        }
        Update: {
          countryId?: number
          divisionId?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "districts_countryId_fkey"
            columns: ["countryId"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "districts_divisionId_fkey"
            columns: ["divisionId"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
        ]
      }
      divisions: {
        Row: {
          countryId: number
          id: number
          name: string
        }
        Insert: {
          countryId: number
          id?: number
          name: string
        }
        Update: {
          countryId?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "divisions_countryId_fkey"
            columns: ["countryId"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      genders: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      marital_statuses: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      nationalities: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          description: string | null
          for: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          description?: string | null
          for?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          description?: string | null
          for?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      religions: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          description: string | null
          for: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          description?: string | null
          for?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          description?: string | null
          for?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      roles_permissions: {
        Row: {
          id: number
          permissionId: number
          roleId: number
        }
        Insert: {
          id?: number
          permissionId: number
          roleId: number
        }
        Update: {
          id?: number
          permissionId?: number
          roleId?: number
        }
        Relationships: [
          {
            foreignKeyName: "roles_permissions_permissionId_fkey"
            columns: ["permissionId"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_permissions_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      states: {
        Row: {
          countryId: number
          id: number
          name: string
        }
        Insert: {
          countryId: number
          id?: number
          name: string
        }
        Update: {
          countryId?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "states_countryId_fkey"
            columns: ["countryId"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_districts: {
        Row: {
          countryId: number
          districtId: number
          divisionId: number
          id: number
          name: string
        }
        Insert: {
          countryId: number
          districtId: number
          divisionId: number
          id?: number
          name: string
        }
        Update: {
          countryId?: number
          districtId?: number
          divisionId?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_districts_countryId_fkey"
            columns: ["countryId"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sub_districts_districtId_fkey"
            columns: ["districtId"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sub_districts_divisionId_fkey"
            columns: ["divisionId"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_portfolio_projects_sort_order: {
        Args: {
          row_id: string
          sort_order: number
        }
        Returns: undefined
      }
    }
    Enums: {
      Gender: "Male" | "Female" | "Others"
      PublicAddressType:
        | "Home"
        | "Office"
        | "Present"
        | "Permanent"
        | "Billing"
        | "Shipping"
        | "Birth"
        | "Other"
      PublicStatus: "New" | "Verified"
      Religion: "Hindu" | "Muslim" | "Christian" | "Buddhist" | "Others"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
