var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import PatientAttachmentModel from "../models/PatientAttachmentModel.js";
let PatientAttachmentRepository = class PatientAttachmentRepository {
    async findByPatientId(patientId) {
        return PatientAttachmentModel.find({ patientId })
            .sort({ uploadedAt: -1 })
            .lean({ virtuals: true })
            .exec();
    }
    async findById(id) {
        return PatientAttachmentModel.findById(id)
            .lean({ virtuals: true })
            .exec();
    }
    async create(attachment) {
        const newAttachment = new PatientAttachmentModel(attachment);
        return newAttachment.save();
    }
    async update(id, attachment) {
        const updatedAttachment = await PatientAttachmentModel.findByIdAndUpdate(id, attachment, { new: true })
            .lean({ virtuals: true })
            .exec();
        return updatedAttachment;
    }
    async delete(id) {
        const result = await PatientAttachmentModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
    async findByCategory(patientId, category) {
        return PatientAttachmentModel.find({
            patientId,
            category
        })
            .sort({ uploadedAt: -1 })
            .lean({ virtuals: true })
            .exec();
    }
};
PatientAttachmentRepository = __decorate([
    injectable()
], PatientAttachmentRepository);
export { PatientAttachmentRepository };
//# sourceMappingURL=PatientAttachmentRepository.js.map