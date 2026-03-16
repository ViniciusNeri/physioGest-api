import type { IPatientAttachmentRepository } from "../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { IPatientAttachmentService } from "../../domain/services/IPatientSubdomainServices.js";
import type { PatientAttachment } from "../../domain/entities/PatientSubdomains.js";
export declare class PatientAttachmentService implements IPatientAttachmentService {
    private repository;
    constructor(repository: IPatientAttachmentRepository);
    getPatientAttachments(patientId: string): Promise<PatientAttachment[]>;
    getAttachmentById(id: string): Promise<PatientAttachment | null>;
    createAttachment(attachment: Omit<PatientAttachment, 'id'>): Promise<PatientAttachment>;
    updateAttachment(id: string, attachment: Partial<PatientAttachment>): Promise<PatientAttachment | null>;
    deleteAttachment(id: string): Promise<boolean>;
    getAttachmentsByCategory(patientId: string, category: string): Promise<PatientAttachment[]>;
}
//# sourceMappingURL=PatientAttachmentService.d.ts.map