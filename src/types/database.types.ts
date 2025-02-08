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
      albums: {
        Row: {
          id: number
          notes: string | null
          release_date: string | null
          title: string
        }
        Insert: {
          id?: number
          notes?: string | null
          release_date?: string | null
          title: string
        }
        Update: {
          id?: number
          notes?: string | null
          release_date?: string | null
          title?: string
        }
        Relationships: []
      }
      contributors: {
        Row: {
          artist_name: string
          first_name: string | null
          id: number
        }
        Insert: {
          artist_name: string
          first_name?: string | null
          id?: number
        }
        Update: {
          artist_name?: string
          first_name?: string | null
          id?: number
        }
        Relationships: []
      }
      project_contributors: {
        Row: {
          contributor_id: number
          project_id: number
        }
        Insert: {
          contributor_id: number
          project_id: number
        }
        Update: {
          contributor_id?: number
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_contributors_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "contributors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_contributors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          album_id: number | null
          bpm: number | null
          date_created: string | null
          folder_path: string | null
          folder_path_hash: string
          id: number
          musical_key: Database["public"]["Enums"]["musical_key"] | null
          notes: string | null
          release_name: string | null
          title: string
        }
        Insert: {
          album_id?: number | null
          bpm?: number | null
          date_created?: string | null
          folder_path?: string | null
          folder_path_hash: string
          id?: number
          musical_key?: Database["public"]["Enums"]["musical_key"] | null
          notes?: string | null
          release_name?: string | null
          title: string
        }
        Update: {
          album_id?: number | null
          bpm?: number | null
          date_created?: string | null
          folder_path?: string | null
          folder_path_hash?: string
          id?: number
          musical_key?: Database["public"]["Enums"]["musical_key"] | null
          notes?: string | null
          release_name?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
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
      musical_key:
        | "C Major"
        | "C Minor"
        | "C# Major"
        | "C# Minor"
        | "D Major"
        | "D Minor"
        | "D# Major"
        | "D# Minor"
        | "E Major"
        | "E Minor"
        | "F Major"
        | "F Minor"
        | "F# Major"
        | "F# Minor"
        | "G Major"
        | "G Minor"
        | "G# Major"
        | "G# Minor"
        | "A Major"
        | "A Minor"
        | "A# Major"
        | "A# Minor"
        | "B Major"
        | "B Minor"
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
