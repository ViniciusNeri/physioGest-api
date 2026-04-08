import type { Agenda } from "../entities/Agenda.js";
import type { AgendaLock } from "../entities/AgendaLock.js";

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
   * Busca agendamentos e bloqueios por usuário (combinado)
   * @param userId - ID do usuário
   * @returns Lista de agendamentos e bloqueios
   */
  getAgendasByUserId(userId: string): Promise<Array<Agenda | AgendaLock>>;

  /**
   * Busca apenas agendamentos por usuário (sem bloqueios)
   * @param userId - ID do usuário
   * @returns Lista de agendamentos
   */
  getAppointmentsByUserId(userId: string): Promise<Agenda[]>;

  /**
   * Busca apenas bloqueios por usuário (sem agendamentos)
   * @param userId - ID do usuário
   * @returns Lista de bloqueios
   */
  getLocksByUserId(userId: string): Promise<AgendaLock[]>;

  /**
   * Busca agendas por paciente
   * @param patientId - ID do paciente
   * @returns Lista de agendas
   */
  getAgendasByPatientId(patientId: string): Promise<Agenda[]>;

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

  /**
   * Bloqueia um horário/dia ou múltiplos dias
   */
  createLock(lock: Omit<AgendaLock, 'id'> & { dates?: (Date | string)[] }): Promise<AgendaLock[]>;

  /**
   * Remove um bloqueio
   */
  deleteLock(lockId: string): Promise<boolean>;

  /**
   * Realiza agendamento online via PIN do paciente
   */
  createOnlineAppointment(params: {
    userId: string;
    pin: string;
    startDate: string | Date;
    categoryId: string;
  }): Promise<Agenda>;

  /**
   * Retorna os horários disponíveis de um usuário em uma data específica
   * @param userId - ID do usuário
   * @param date - Data no formato YYYY-MM-DD
   */
  getAvailableSlots(userId: string, date: string): Promise<string[]>;
}