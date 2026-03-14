export interface User {
  id?: string;       // opcional, gerado pelo banco
  name: string;
  email: string;
  password?: string; // opcional para usuários do Google
  verified: boolean;
  googleId?: string; // opcional para usuários do Google
}
