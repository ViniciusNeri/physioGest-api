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
     * Verifica se há conflito de agendamento para um usuário em um determinado período
     * @param userId - ID do usuário
     * @param startDate - Data inicial
     * @param endDate - Data final
     * @param excludeId - (Opcional) ID de agenda para ignorar (usado no update)
     */
    hasOverlap(userId: string, startDate: Date, endDate: Date, excludeId?: string): Promise<boolean>;
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
}
//# sourceMappingURL=IAgendaRepository.d.ts.map