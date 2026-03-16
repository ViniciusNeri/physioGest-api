export interface Patient {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
  gender?: 'male' | 'female' | 'other';
  profession?: string;
  observations?: string;
  userId: string;
}