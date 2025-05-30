export interface Account {
  id: string;
  owner: string;
  balance: number;
  createdAt: Date;
}

export interface TransactionResult {
  success: boolean;
  message: string;
  balance?: number;
} 