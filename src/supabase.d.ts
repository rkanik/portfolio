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
      attachments: {
        Row: {
          base64: string | null
          createdAt: string | null
          id: string
          mimeType: string | null
          name: string
          src: string
          thumbnail: string | null
          updatedAt: string | null
        }
        Insert: {
          base64?: string | null
          createdAt?: string | null
          id?: string
          mimeType?: string | null
          name: string
          src: string
          thumbnail?: string | null
          updatedAt?: string | null
        }
        Update: {
          base64?: string | null
          createdAt?: string | null
          id?: string
          mimeType?: string | null
          name?: string
          src?: string
          thumbnail?: string | null
          updatedAt?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      projectAttachments: {
        Row: {
          attachmentId: string
          createdAt: string | null
          id: string
          projectId: string
          updatedAt: string | null
        }
        Insert: {
          attachmentId: string
          createdAt?: string | null
          id?: string
          projectId: string
          updatedAt?: string | null
        }
        Update: {
          attachmentId?: string
          createdAt?: string | null
          id?: string
          projectId?: string
          updatedAt?: string | null
        }
      }
      projects: {
        Row: {
          createdAt: string | null
          description: string | null
          id: string
          name: string
          previewUrl: string | null
          slug: string
          sortOrder: number
          sourceCodeUrl: string | null
          status: string
          tags: string | null
          updatedAt: string | null
          userId: string
        }
        Insert: {
          createdAt?: string | null
          description?: string | null
          id?: string
          name: string
          previewUrl?: string | null
          slug?: string
          sortOrder?: number
          sourceCodeUrl?: string | null
          status?: string
          tags?: string | null
          updatedAt?: string | null
          userId: string
        }
        Update: {
          createdAt?: string | null
          description?: string | null
          id?: string
          name?: string
          previewUrl?: string | null
          slug?: string
          sortOrder?: number
          sourceCodeUrl?: string | null
          status?: string
          tags?: string | null
          updatedAt?: string | null
          userId?: string
        }
      }
      projectTechnologies: {
        Row: {
          created_at: string | null
          id: number
          projectId: string
          technologyId: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          projectId: string
          technologyId: string
        }
        Update: {
          created_at?: string | null
          id?: number
          projectId?: string
          technologyId?: string
        }
      }
      technologies: {
        Row: {
          created_at: string | null
          "description ": string | null
          icon: string
          id: string
          name: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          "description "?: string | null
          icon: string
          id?: string
          name: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          "description "?: string | null
          icon?: string
          id?: string
          name?: string
          url?: string | null
        }
      }
      userTechnologies: {
        Row: {
          created_at: string | null
          id: string
          technologyId: string
          userId: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          technologyId: string
          userId: string
        }
        Update: {
          created_at?: string | null
          id?: string
          technologyId?: string
          userId?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_project_sort_orders: {
        Args: {
          sort_order_above: number
        }
        Returns: undefined
      }
      incrementprojectsortorders: {
        Args: {
          sortorder: number
        }
        Returns: undefined
      }
      sync_project_sort_order: {
        Args: {
          so: number
        }
        Returns: undefined
      }
      update_sort_order: {
        Args: {
          row_id: string
          sort_order: number
        }
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
