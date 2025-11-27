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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'patient' | 'doctor' | null
          created_at: string
          updated_at: string
          age: number | null
          skin_type: string | null
          dermatologist: string | null
          email: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'patient' | 'doctor' | null
          created_at?: string
          updated_at?: string
          age?: number | null
          skin_type?: string | null
          dermatologist?: string | null
          email?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'patient' | 'doctor' | null
          created_at?: string
          updated_at?: string
          age?: number | null
          skin_type?: string | null
          dermatologist?: string | null
          email?: string | null
        }
      }
      medical_records: {
        Row: {
          id: string
          patient_id: string
          title: string
          description: string | null
          record_date: string
          provider: string
          blockchain_hash: string | null
          verification_status: 'pending' | 'verified' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          title: string
          description?: string | null
          record_date: string
          provider: string
          blockchain_hash?: string | null
          verification_status?: 'pending' | 'verified' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          title?: string
          description?: string | null
          record_date?: string
          provider?: string
          blockchain_hash?: string | null
          verification_status?: 'pending' | 'verified' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Enums: {
      user_role: "patient" | "doctor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}