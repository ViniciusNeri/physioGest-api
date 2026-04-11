import type { Financial } from "../entities/Financial.js";

export interface FinancialConsolidated {
  monthlyTotal: number;
  pendingTotal: number;
  expenses: number;
  variableExpenses: number;
  netProfit: number;
  totalIncome: number;
  totalExpenses: number;
  incomeByMethod: Record<string, number>;
  expenseByMethod: Record<string, number>;
  expensesByCategory: Record<string, number>;
  cashFlow: Array<{
    id: string;
    source: 'clinic' | 'patient';
    date: string;
    amount: number;
    type: 'income' | 'expense';
    description: string;
    category?: string | undefined;
    expenseType?: 'fixed' | 'variable' | undefined;
    patientName?: string | undefined;
    status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  }>;
  monthlyHistory: Record<string, { income: number; expenses: number }>;
}

export interface IFinancialService {
  /**
   * Busca um resumo financeiro mensal consolidado
   * @param userId - ID do usuário
   * @param month - Mês do registro
   * @param year - Ano do registro
   * @returns Resumo consolidado
   */
  getMonthlyConsolidated(userId: string, month: number, year: number): Promise<FinancialConsolidated>;

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
  deleteFinancial(id: string, source?: string): Promise<boolean>;
}