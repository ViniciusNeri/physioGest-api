import type { Financial } from "../entities/Financial.js";
export interface IFinancialRepository {
    /**
     * Busca um registro financeiro pelo ID
     * @param id - ID do registro
     * @returns Financial ou null se não encontrado
     */
    findById(id: string): Promise<Financial | null>;
    /**
     * Busca todos os registros financeiros
     * @returns Lista de registros financeiros
     */
    findAll(): Promise<Financial[]>;
    /**
     * Busca registros financeiros por usuário
     * @param userId - ID do usuário
     * @returns Lista de registros financeiros
     */
    findByUserId(userId: string): Promise<Financial[]>;
    /**
     * Busca registros financeiros por filtros
     * @param userId - ID do usuário
     * @param month - Mês do registro
     * @param year - Ano do registro
     * @returns Lista de registros financeiros
     */
    findByFilters(userId: string, month: number, year: number): Promise<Financial[]>;
    /**
     * Busca registros financeiros por paciente
     * @param patientId - ID do paciente
     * @returns Lista de registros financeiros
     */
    findByPatientId(patientId: string): Promise<Financial[]>;
    /**
     * Cria um novo registro financeiro
     * @param financial - dados do registro
     * @returns Financial criado
     */
    create(financial: Financial): Promise<Financial>;
    /**
     * Atualiza um registro financeiro
     * @param id - ID do registro
     * @param financial - dados atualizados
     * @returns Financial atualizado ou null se não encontrado
     */
    update(id: string, financial: Partial<Financial>): Promise<Financial | null>;
    /**
     * Deleta um registro financeiro
     * @param id - ID do registro
     * @returns true se deletado, false se não encontrado
     */
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=IFinancialRepository.d.ts.map