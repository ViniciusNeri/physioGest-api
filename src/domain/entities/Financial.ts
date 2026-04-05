export interface Financial {
  id?: string;
  type: 'income' | 'expense';
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  amount: number;
  date: Date;
  description: string;
  category?: string;
  expenseType?: 'fixed' | 'variable';
  paymentMethod?: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'check' | 'other';
  userId: string;
  patientId?: string;
}