export interface PaymentMethod {
  id?: string;
  userId: string | null;
  name: string;
  type?: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'check' | 'other';
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  settingsId?: string | null;
}
