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
    create(user: Omit<User, 'id'>): Promise<User>;
    /**
     * Atualiza um usuário
     * @param id - ID do usuário
     * @param user - dados para atualizar
     * @returns Usuário atualizado
     */
    update(id: string, user: Partial<User>): Promise<User>;
}
//# sourceMappingURL=IAuthenticateRepository.d.ts.map