import type { User } from "../entities/User.js";

export interface IUserService {
  /**
   * Busca um usuário pelo ID
   * @param id - ID do usuário
   * @returns Usuário ou null se não encontrado
   */
  getUserById(id: string): Promise<User | null>;

  /**
   * Busca todos os usuários
   * @returns Lista de usuários
   */
  getAllUsers(): Promise<User[]>;

  /**
   * Cria um novo usuário
   * @param user - dados do usuário
   * @returns Usuário criado
   */
  createUser(user: Omit<User, 'id' | 'verified'> & { verified?: boolean }): Promise<User>;

  /**
   * Atualiza um usuário
   * @param id - ID do usuário
   * @param user - dados atualizados
   * @returns Usuário atualizado ou null se não encontrado
   */
  updateUser(id: string, user: Partial<User>): Promise<User | null>;

  /**
   * Deleta um usuário
   * @param id - ID do usuário
   * @returns true se deletado, false se não encontrado
   */
  deleteUser(id: string): Promise<boolean>;
}