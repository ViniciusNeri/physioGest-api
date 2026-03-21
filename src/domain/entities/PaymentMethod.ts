export interface PaymentMethod {
  id?: string;
  userId: string;
  name: string;
  type: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'check' | 'other';
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
