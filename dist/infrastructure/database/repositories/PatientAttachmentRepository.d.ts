import type { IPatientAttachmentRepository } from "../../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { PatientAttachment } from "../../../domain/entities/PatientSubdomains.js";
export declare class PatientAttachmentRepository implements IPatientAttachmentRepository {
    findByPatientId(patientId: string): Promise<PatientAttachment[]>;
    findById(id: string): Promise<PatientAttachment | null>;
    create(attachment: Omit<PatientAttachment, 'id'>): Promise<PatientAttachment>;
    update(id: string, attachment: Partial<PatientAttachment>): Promise<PatientAttachment | null>;
    delete(id: string): Promise<boolean>;
    findByCategory(patientId: string, category: string): Promise<PatientAttachment[]>;
}
//# sourceMappingURL=PatientAttachmentRepository.d.ts.map