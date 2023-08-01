export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attachments: {
        Row: {
          base64: string | null
          bucket: string
          createdAt: string | null
          folder: string
          id: string
          medium: string | null
          mimeType: string | null
          name: string
          src: string
          thumbnail: string | null
          updatedAt: string | null
          userId: string
        }
        Insert: {
          base64?: string | null
          bucket?: string
          createdAt?: string | null
          folder?: string
          id?: string
          medium?: string | null
          mimeType?: string | null
          name: string
          src: string
          thumbnail?: string | null
          updatedAt?: string | null
          userId?: string
        }
        Update: {
          base64?: string | null
          bucket?: string
          createdAt?: string | null
          folder?: string
          id?: string
          medium?: string | null
          mimeType?: string | null
          name?: string
          src?: string
          thumbnail?: string | null
          updatedAt?: string | null
          userId?: string
        }
        Relationships: []
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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          educations: Json[]
          experiences: Json[]
          full_name: string | null
          github: Json | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          educations?: Json[]
          experiences?: Json[]
          full_name?: string | null
          github?: Json | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          educations?: Json[]
          experiences?: Json[]
          full_name?: string | null
          github?: Json | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      projectAttachments: {
        Row: {
          attachmentId: string
          id: number
          projectId: string
          sortOrder: number
        }
        Insert: {
          attachmentId: string
          id?: number
          projectId: string
          sortOrder: number
        }
        Update: {
          attachmentId?: string
          id?: number
          projectId?: string
          sortOrder?: number
        }
        Relationships: [
          {
            foreignKeyName: "projectAttachments_attachmentId_fkey"
            columns: ["attachmentId"]
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projectAttachments_projectId_fkey"
            columns: ["projectId"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          createdAt: string | null
          description: string | null
          id: string
          name: string
          previewUrl: string | null
          repository: Json | null
          repositoryOwner: string | null
          repositoryRepo: string | null
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
          repository?: Json | null
          repositoryOwner?: string | null
          repositoryRepo?: string | null
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
          repository?: Json | null
          repositoryOwner?: string | null
          repositoryRepo?: string | null
          slug?: string
          sortOrder?: number
          sourceCodeUrl?: string | null
          status?: string
          tags?: string | null
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_userId_fkey"
            columns: ["userId"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      projectTechnologies: {
        Row: {
          id: number
          isVisible: boolean | null
          projectId: string
          sortOrder: number
          technologyId: string
        }
        Insert: {
          id?: number
          isVisible?: boolean | null
          projectId: string
          sortOrder?: number
          technologyId: string
        }
        Update: {
          id?: number
          isVisible?: boolean | null
          projectId?: string
          sortOrder?: number
          technologyId?: string
        }
        Relationships: [
          {
            foreignKeyName: "projectTechnologies_projectId_fkey"
            columns: ["projectId"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projectTechnologies_technologyId_fkey"
            columns: ["technologyId"]
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          }
        ]
      }
      technologies: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          icon: string
          id: string
          name: string
          url: string | null
        }
        Insert: {
          color?: string
          created_at?: string | null
          description?: string | null
          icon: string
          id?: string
          name: string
          url?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
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
          date: string | null
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
          date?: string | null
          id?: number
          name: string
          rating: number
          sortOrder: number
          status?: string
          testimonial: string
          updatedAt?: string
          userId?: string
        }
        Update: {
          avatar?: string | null
          company?: string | null
          createdAt?: string
          date?: string | null
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
            foreignKeyName: "testimonials_avatar_fkey"
            columns: ["avatar"]
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_userId_fkey"
            columns: ["userId"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "userTechnologies_technologyId_fkey"
            columns: ["technologyId"]
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userTechnologies_userId_fkey"
            columns: ["userId"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      userTestimonials: {
        Row: {
          createdAt: string
          id: number
          testimonialId: number
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: number
          testimonialId: number
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: number
          testimonialId?: number
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "userTestimonials_testimonialId_fkey"
            columns: ["testimonialId"]
            referencedRelation: "testimonials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userTestimonials_userId_fkey"
            columns: ["userId"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
