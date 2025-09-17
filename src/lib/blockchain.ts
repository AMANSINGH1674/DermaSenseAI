import { createHash } from 'crypto';

export interface BlockchainLog {
  txHash: string;
  timestamp: string;
  blockNumber: number;
  status: 'confirmed' | 'pending';
  data: string;
}

export class BlockchainVerification {
  // Generate a hash for a medical record
  static generateHash(record: {
    id: string;
    patient_id: string;
    title: string;
    description: string;
    record_date: string;
    provider: string;
  }): string {
    const data = JSON.stringify(record);
    return createHash('sha256').update(data).digest('hex');
  }

  // Verify a record's hash
  static verifyHash(record: {
    id: string;
    patient_id: string;
    title: string;
    description: string;
    record_date: string;
    provider: string;
    blockchain_hash: string;
  }): boolean {
    const currentHash = this.generateHash({
      id: record.id,
      patient_id: record.patient_id,
      title: record.title,
      description: record.description,
      record_date: record.record_date,
      provider: record.provider,
    });
    return currentHash === record.blockchain_hash;
  }

  // Mock blockchain transaction log
  static async getTransactionLog(hash: string): Promise<BlockchainLog> {
    // Simulate blockchain API response
    return {
      txHash: hash,
      timestamp: new Date().toISOString(),
      blockNumber: Math.floor(Math.random() * 1000000) + 8000000,
      status: 'confirmed',
      data: hash
    };
  }
}