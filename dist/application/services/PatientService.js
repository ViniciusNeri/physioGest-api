var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from "tsyringe";
import logger from "../../infrastructure/logging/Logger.js";
let PatientService = class PatientService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getPatientById(id) {
        logger.debug("Buscando paciente por ID", { patientId: id });
        try {
            const patient = await this.repository.findById(id);
            if (patient) {
                logger.debug("Paciente encontrado", { patientId: id, name: patient.name });
            }
            else {
                logger.warn("Paciente não encontrado", { patientId: id });
            }
            return patient;
        }
        catch (error) {
            logger.error("Erro ao buscar paciente por ID", error, { patientId: id });
            throw error;
        }
    }
    async getPatientsByUserId(userId) {
        logger.debug("Buscando pacientes por userId", { userId });
        try {
            const patients = await this.repository.findByUserId(userId);
            logger.info("Pacientes encontrados", { userId, count: patients.length });
            return patients;
        }
        catch (error) {
            logger.error("Erro ao buscar pacientes por userId", error, { userId });
            throw error;
        }
    }
    async getAllPatients() {
        logger.debug("Buscando todos os pacientes");
        try {
            const patients = await this.repository.findAll();
            logger.info("Pacientes encontrados", { count: patients.length });
            return patients;
        }
        catch (error) {
            logger.error("Erro ao buscar todos os pacientes", error);
            throw error;
        }
    }
    async createPatient(patient) {
        logger.debug("Criando paciente", { name: patient.name, userId: patient.userId });
        try {
            // Gerar PIN de 4 dígitos único por usuário
            let pin = "";
            let pinUnique = false;
            let attempts = 0;
            while (!pinUnique && attempts < 10) {
                pin = Math.floor(1000 + Math.random() * 9000).toString();
                const existingWithPin = await this.repository.findByPin(patient.userId, pin);
                if (!existingWithPin) {
                    pinUnique = true;
                }
                attempts++;
            }
            const patientWithPin = { ...patient, pin };
            const createdPatient = await this.repository.create(patientWithPin);
            logger.info("Paciente criado com sucesso", {
                patientId: createdPatient.id,
                name: createdPatient.name,
                userId: createdPatient.userId
            });
            return createdPatient;
        }
        catch (error) {
            logger.error("Erro ao criar paciente", error, { name: patient.name, userId: patient.userId });
            throw error;
        }
    }
    async updatePatient(id, patient) {
        logger.debug("Atualizando paciente", { patientId: id, updates: Object.keys(patient) });
        try {
            const updatedPatient = await this.repository.update(id, patient);
            if (updatedPatient) {
                logger.info("Paciente atualizado com sucesso", {
                    patientId: id,
                    name: updatedPatient.name,
                    updates: Object.keys(patient)
                });
            }
            else {
                logger.warn("Paciente não encontrado para atualização", { patientId: id });
            }
            return updatedPatient;
        }
        catch (error) {
            logger.error("Erro ao atualizar paciente", error, { patientId: id });
            throw error;
        }
    }
    async deletePatient(id) {
        logger.debug("Deletando paciente", { patientId: id });
        try {
            const deleted = await this.repository.delete(id);
            if (deleted) {
                logger.info("Paciente deletado com sucesso", { patientId: id });
            }
            else {
                logger.warn("Paciente não encontrado para deleção", { patientId: id });
            }
            return deleted;
        }
        catch (error) {
            logger.error("Erro ao deletar paciente", error, { patientId: id });
            throw error;
        }
    }
};
PatientService = __decorate([
    injectable(),
    __param(0, inject("IPatientRepository")),
    __metadata("design:paramtypes", [Object])
], PatientService);
export { PatientService };
//# sourceMappingURL=PatientService.js.map