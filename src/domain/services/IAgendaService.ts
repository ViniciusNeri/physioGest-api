import type { Agenda } from "../entities/Agenda.js";

export interface IAgendaService {
  /**
   * Busca uma agenda pelo ID
   * @param id - ID da agenda
   * @returns Agenda ou null se não encontrada
   */
  getAgendaById(id: string): Promise<Agenda | null>;

  /**
   * Busca todas as agendas
   * @returns Lista de agendas
   */
  getAllAgendas(): Promise<Agenda[]>;

  /**
   * Busca agendas por usuário
   * @param userId - ID do usuário
   * @returns Lista de agendas
   */
  getAgendasByUserId(userId: string): Promise<Agenda[]>;

  /**
   * Cria uma nova agenda
   * @param agenda - dados da agenda
   * @returns Agenda criada
   */
  createAgenda(agenda: Omit<Agenda, 'id'>): Promise<Agenda>;

  /**
   * Atualiza uma agenda
   * @param id - ID da agenda
   * @param agenda - dados atualizados
   * @returns Agenda atualizada ou null se não encontrada
   */
  updateAgenda(id: string, agenda: Partial<Agenda>): Promise<Agenda | null>;

  /**
   * Deleta uma agenda
   * @param id - ID da agenda
   * @returns true se deletada, false se não encontrada
   */
  deleteAgenda(id: string): Promise<boolean>;
}