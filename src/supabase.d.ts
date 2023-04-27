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
          description: string
          id: string
          name: string
          previewUrl: string | null
          sortOrder: number
          sourceCodeUrl: string | null
          status: string
          tags: string | null
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string | null
          description: string
          id?: string
          name: string
          previewUrl?: string | null
          sortOrder?: number
          sourceCodeUrl?: string | null
          status?: string
          tags?: string | null
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string | null
          description?: string
          id?: string
          name?: string
          previewUrl?: string | null
          sortOrder?: number
          sourceCodeUrl?: string | null
          status?: string
          tags?: string | null
          updatedAt?: string | null
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
