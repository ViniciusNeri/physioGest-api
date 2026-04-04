import type { IAgendaRepository } from "../../domain/interfaces/IAgendaRepository.js";
import type { IAgendaService } from "../../domain/services/IAgendaService.js";
import type { Agenda } from "../../domain/entities/Agenda.js";
import type { ILogger } from "../../infrastructure/logging/Logger.js";
import type { IPatientActivityService } from "../../domain/services/IPatientActivityService.js";
export declare class AgendaService implements IAgendaService {
    private repository;
    private logger;
    private activityService;
    constructor(repository: IAgendaRepository, logger: ILogger, activityService: IPatientActivityService);
    private normalizeStatus;
    getAgendaById(id: string): Promise<Agenda | null>;
    getAllAgendas(): Promise<Agenda[]>;
    getAgendasByUserId(userId: string): Promise<Agenda[]>;
    getAgendasByPatientId(patientId: string): Promise<Agenda[]>;
    createAgenda(agenda: Omit<Agenda, 'id'>): Promise<Agenda>;
    updateAgenda(id: string, agenda: Partial<Agenda>): Promise<Agenda | null>;
    deleteAgenda(id: string): Promise<boolean>;
}
//# sourceMappingURL=AgendaService.d.ts.map