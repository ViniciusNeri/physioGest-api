import { injectable } from "tsyringe";
import type { IPatientAttachmentRepository } from "../../../domain/interfaces/IPatientSubdomainRepositories.js";
import type { PatientAttachment } from "../../../domain/entities/PatientSubdomains.js";
import PatientAttachmentModel from "../models/PatientAttachmentModel.js";

@injectable()
export class PatientAttachmentRepository implements IPatientAttachmentRepository {
  async findByPatientId(patientId: string): Promise<PatientAttachment[]> {
    return PatientAttachmentModel.find({ patientId })
      .sort({ uploadedAt: -1 })
      .lean<PatientAttachment[]>({ virtuals: true })
      .exec();
  }

  async findById(id: string): Promise<PatientAttachment | null> {
    return PatientAttachmentModel.findById(id)
      .lean<PatientAttachment>({ virtuals: true })
      .exec();
  }

  async create(attachment: Omit<PatientAttachment, 'id'>): Promise<PatientAttachment> {
    const newAttachment = new PatientAttachmentModel(attachment);
    return newAttachment.save();
  }

  async update(id: string, attachment: Partial<PatientAttachment>): Promise<PatientAttachment | null> {
    const updatedAttachment = await PatientAttachmentModel.findByIdAndUpdate(id, attachment, { new: true })
      .lean<PatientAttachment>({ virtuals: true })
      .exec();
    return updatedAttachment;
  }

  async delete(id: string): Promise<boolean> {
    const result = await PatientAttachmentModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findByCategory(patientId: string, category: string): Promise<PatientAttachment[]> {
    return PatientAttachmentModel.find({
      patientId,
      category
    })
      .sort({ uploadedAt: -1 })
      .lean<PatientAttachment[]>({ virtuals: true })
      .exec();
  }
}