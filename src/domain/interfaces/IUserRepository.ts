import type { User } from "../entities/User.js";

export interface IUserRepository {
  /**
   * Busca um usuário pelo ID
   * @param id - ID do usuário
   * @returns Usuário ou null se não encontrado
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca um usuário pelo e-mail
   * @param email - e-mail do usuário
   * @returns Usuário ou null se não encontrado
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca todos os usuários
   * @returns Lista de usuários
   */
  findAll(): Promise<User[]>;

  /**
   * Cria um novo usuário
   * @param user - dados do usuário
   * @returns Usuário criado
   */
  create(user: User): Promise<User>;

  /**
   * Atualiza um usuário
   * @param id - ID do usuário
   * @param user - dados atualizados
   * @returns Usuário atualizado ou null se não encontrado
   */
  update(id: string, user: Partial<User>): Promise<User | null>;

  /**
   * Deleta um usuário
   * @param id - ID do usuário
   * @returns true se deletado, false se não encontrado
   */
  delete(id: string): Promise<boolean>;
}