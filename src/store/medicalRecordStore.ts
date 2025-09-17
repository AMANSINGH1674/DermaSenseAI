import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { BlockchainVerification } from '../lib/blockchain';
import type { Database } from '../lib/database.types';

type MedicalRecord = Database['public']['Tables']['medical_records']['Row'];

interface MedicalRecordState {
  records: MedicalRecord[];
  isLoading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  addRecord: (record: Omit<MedicalRecord, 'id' | 'blockchain_hash' | 'verification_status' | 'created_at' | 'updated_at'>) => Promise<void>;
  verifyRecord: (record: MedicalRecord) => Promise<boolean>;
}

export const useMedicalRecordStore = create<MedicalRecordState>((set, get) => ({
  records: [],
  isLoading: false,
  error: null,

  fetchRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .order('record_date', { ascending: false });

      if (error) throw error;
      set({ records: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addRecord: async (record) => {
    set({ isLoading: true, error: null });
    try {
      // Generate blockchain hash
      const hash = BlockchainVerification.generateHash({
        ...record,
        id: crypto.randomUUID(),
      });

      const { data, error } = await supabase
        .from('medical_records')
        .insert([{
          ...record,
          blockchain_hash: hash,
          verification_status: 'verified'
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        records: [data, ...state.records]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  verifyRecord: async (record) => {
    try {
      const isValid = BlockchainVerification.verifyHash(record);
      
      if (!isValid) {
        await supabase
          .from('medical_records')
          .update({ verification_status: 'failed' })
          .eq('id', record.id);
        
        set(state => ({
          records: state.records.map(r => 
            r.id === record.id 
              ? { ...r, verification_status: 'failed' }
              : r
          )
        }));
        return false;
      }

      await supabase
        .from('medical_records')
        .update({ verification_status: 'verified' })
        .eq('id', record.id);
      
      set(state => ({
        records: state.records.map(r => 
          r.id === record.id 
            ? { ...r, verification_status: 'verified' }
            : r
        )
      }));
      return true;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  }
}));