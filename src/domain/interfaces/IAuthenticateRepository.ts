import type { User } from "../entities/User.js";

export interface IAuthenticateRepository {
  /**
   * Busca um usuário pelo e-mail
   * @param email - e-mail do usuário
   * @returns Usuário ou null se não encontrado
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Cria um novo usuário
   * @param user - dados do usuário
   * @returns Usuário criado
   */
  create(user: User): Promise<User>;
}
