export interface Financial {
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  date: Date;
  description: string;
  userId: string;
}