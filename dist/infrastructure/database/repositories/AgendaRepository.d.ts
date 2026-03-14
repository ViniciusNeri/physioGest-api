import type { IAgendaRepository } from "../../../domain/interfaces/IAgendaRepository.js";
import type { Agenda } from "../../../domain/entities/Agenda.js";
export declare class AgendaRepository implements IAgendaRepository {
    findById(id: string): Promise<Agenda | null>;
    findAll(): Promise<Agenda[]>;
    findByUserId(userId: string): Promise<Agenda[]>;
    create(agenda: Agenda): Promise<Agenda>;
    update(id: string, agenda: Partial<Agenda>): Promise<Agenda | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=AgendaRepository.d.ts.map