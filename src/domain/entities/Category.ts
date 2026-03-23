export interface Category {
  id?: string;
  userId: string | null;  
  name: string;
  description?: string;
  type: 'Traumato-Ortopédica' | 'Esportiva' | 'Neurofuncional' | 'Geriatria' | 'Pediatria' | 'Outros' | 'RPG';
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  settingsId?: string| null;
}
