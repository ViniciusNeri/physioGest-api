import type { Financial } from "../entities/Financial.js";
export interface IFinancialService {
    /**
     * Busca um registro financeiro pelo ID
     * @param id - ID do registro
     * @returns Financial ou null se não encontrado
     */
    getFinancialById(id: string): Promise<Financial | null>;
    /**
     * Busca todos os registros financeiros
     * @returns Lista de registros financeiros
     */
    getAllFinancials(): Promise<Financial[]>;
    /**
     * Busca registros financeiros por usuário
     * @param userId - ID do usuário
     * @returns Lista de registros financeiros
     */
    getFinancialsByUserId(userId: string): Promise<Financial[]>;
    /**
     * Busca registros financeiros por paciente
     * @param patientId - ID do paciente
     * @returns Lista de registros financeiros
     */
    getFinancialsByPatientId(patientId: string): Promise<Financial[]>;
    /**
     * Cria um novo registro financeiro
     * @param financial - dados do registro
     * @returns Financial criado
     */
    createFinancial(financial: Omit<Financial, 'id'>): Promise<Financial>;
    /**
     * Atualiza um registro financeiro
     * @param id - ID do registro
     * @param financial - dados atualizados
     * @returns Financial atualizado ou null se não encontrado
     */
    updateFinancial(id: string, financial: Partial<Financial>): Promise<Financial | null>;
    /**
     * Deleta um registro financeiro
     * @param id - ID do registro
     * @returns true se deletado, false se não encontrado
     */
    deleteFinancial(id: string): Promise<boolean>;
}
//# sourceMappingURL=IFinancialService.d.ts.map