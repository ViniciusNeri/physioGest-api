import type { Agenda } from "../entities/Agenda.js";

export interface IAgendaRepository {
  /**
   * Busca uma agenda pelo ID
   * @param id - ID da agenda
   * @returns Agenda ou null se não encontrada
   */
  findById(id: string): Promise<Agenda | null>;

  /**
   * Busca todas as agendas
   * @returns Lista de agendas
   */
  findAll(): Promise<Agenda[]>;

  /**
   * Busca agendas por usuário
   * @param userId - ID do usuário
   * @returns Lista de agendas
   */
  findByUserId(userId: string): Promise<Agenda[]>;

  /**
   * Busca agendas por pacinete
   * @param patientId - ID do paciente
   * @returns Lista de agendas
   */
  findByPatientId(patientId: string): Promise<Agenda[]>;

  /**
   * Verifica sobreposicao de horario
   * @param patientId - ID do paciente
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @param excludeId - (Opcional) ID de agenda para ignorar (usado no update)
   */
  hasOverlap(userId: string, patientId: string, startDate: string, endDate: string, excludeId?: string): Promise<boolean>;

  /**
   * Busca agendamentos ativos em um intervalo de datas para um usuario
   * @param userId - ID do usuario
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @returns Lista de agendamentos no periodo
   */
  findByDateRange(userId: string, startDate: string, endDate: string): Promise<Agenda[]>;

  /**
   * Cria uma nova agenda
   * @param agenda - dados da agenda
   * @returns Agenda criada
   */
  create(agenda: Agenda): Promise<Agenda>;

  /**
   * Atualiza uma agenda
   * @param id - ID da agenda
   * @param agenda - dados atualizados
   * @returns Agenda atualizada ou null se não encontrada
   */
  update(id: string, agenda: Partial<Agenda>): Promise<Agenda | null>;

  /**
   * Deleta uma agenda
   * @param id - ID da agenda
   * @returns true se deletada, false se não encontrada
   */
  delete(id: string): Promise<boolean>;

  /**
   * Conta agendamentos futuros em um dia específico da semana
   * @param userId - ID do usuário
   * @param weekday - Dia da semana (0-6)
   * @param timezone - Fuso horário para converter UTC para local
   */
  countFutureAppointmentsOnWeekday(userId: string, weekday: number, timezone: string): Promise<number>;
}