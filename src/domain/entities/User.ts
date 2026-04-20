export interface User {
  id?: string;       // opcional, gerado pelo banco
  name: string;
  email: string;
  phone: string;     // telefone com DDD, somente números (ex: 5511999998888)
  password?: string; // opcional para usuários do Google
  verified: boolean;
  googleId?: string; // opcional para usuários do Google
}
