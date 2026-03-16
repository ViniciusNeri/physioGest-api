import { Router } from "express";
import { PatientAnamnesisController } from "./PatientAnamnesisController.js";

const patientAnamnesisRoutes = Router();
const controller = new PatientAnamnesisController();

/**
 * @swagger
 * components:
 *   schemas:
 *     PatientAnamnesis:
 *       type: object
 *       required:
 *         - patientId
 *         - userId
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da anamnese
 *         patientId:
 *           type: string
 *           description: ID do paciente
 *         userId:
 *           type: string
 *           description: ID do usuário
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data da anamnese
 *         chiefComplaint:
 *           type: string
 *           description: Queixa principal
 *         historyOfPresentIllness:
 *           type: string
 *           description: História da doença atual
 *         pastMedicalHistory:
 *           type: string
 *           description: Antecedentes pessoais
 *         familyHistory:
 *           type: string
 *           description: Antecedentes familiares
 *         socialHistory:
 *           type: string
 *           description: Antecedentes sociais
 *         reviewOfSystems:
 *           type: string
 *           description: Revisão de sistemas
 *         physicalExamination:
 *           type: string
 *           description: Exame físico
 *         assessment:
 *           type: string
 *           description: Avaliação
 *         plan:
 *           type: string
 *           description: Plano de tratamento
 *         notes:
 *           type: string
 *           description: Observações adicionais
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         patientId: 60d5ecb74b24c72b8c8b4568
 *         userId: 60d5ecb74b24c72b8c8b4569
 *         date: 2024-01-15T10:00:00.000Z
 *         chiefComplaint: Dor lombar crônica
 *         historyOfPresentIllness: Paciente apresenta dor lombar há 6 meses
 *         pastMedicalHistory: Nega patologias prévias
 *         familyHistory: Pai com hipertensão
 *         socialHistory: Não fumante, pratica atividade física regularmente
 *         reviewOfSystems: Sem alterações significativas
 *         physicalExamination: Postura alterada, limitação de movimento
 *         assessment: Lombalgia crônica
 *         plan: Iniciar tratamento fisioterapêutico
 *         notes: Paciente motivado para tratamento
 *         createdAt: 2024-01-10T09:00:00.000Z
 *         updatedAt: 2024-01-10T09:00:00.000Z
 *     CreatePatientAnamnesis:
 *       type: object
 *       required:
 *         - date
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data da anamnese
 *         chiefComplaint:
 *           type: string
 *           description: Queixa principal
 *         historyOfPresentIllness:
 *           type: string
 *           description: História da doença atual
 *         pastMedicalHistory:
 *           type: string
 *           description: Antecedentes pessoais
 *         familyHistory:
 *           type: string
 *           description: Antecedentes familiares
 *         socialHistory:
 *           type: string
 *           description: Antecedentes sociais
 *         reviewOfSystems:
 *           type: string
 *           description: Revisão de sistemas
 *         physicalExamination:
 *           type: string
 *           description: Exame físico
 *         assessment:
 *           type: string
 *           description: Avaliação
 *         plan:
 *           type: string
 *           description: Plano de tratamento
 *         notes:
 *           type: string
 *           description: Observações adicionais
 *       example:
 *         date: 2024-01-15T10:00:00.000Z
 *         chiefComplaint: Dor lombar crônica
 *         historyOfPresentIllness: Paciente apresenta dor lombar há 6 meses
 *         pastMedicalHistory: Nega patologias prévias
 *         familyHistory: Pai com hipertensão
 *         socialHistory: Não fumante, pratica atividade física regularmente
 *         reviewOfSystems: Sem alterações significativas
 *         physicalExamination: Postura alterada, limitação de movimento
 *         assessment: Lombalgia crônica
 *         plan: Iniciar tratamento fisioterapêutico
 *         notes: Paciente motivado para tratamento
 *     UpdatePatientAnamnesis:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data da anamnese
 *         chiefComplaint:
 *           type: string
 *           description: Queixa principal
 *         historyOfPresentIllness:
 *           type: string
 *           description: História da doença atual
 *         pastMedicalHistory:
 *           type: string
 *           description: Antecedentes pessoais
 *         familyHistory:
 *           type: string
 *           description: Antecedentes familiares
 *         socialHistory:
 *           type: string
 *           description: Antecedentes sociais
 *         reviewOfSystems:
 *           type: string
 *           description: Revisão de sistemas
 *         physicalExamination:
 *           type: string
 *           description: Exame físico
 *         assessment:
 *           type: string
 *           description: Avaliação
 *         plan:
 *           type: string
 *           description: Plano de tratamento
 *         notes:
 *           type: string
 *           description: Observações adicionais
 *       example:
 *         assessment: Lombalgia crônica - Melhora significativa
 *         plan: Continuar tratamento fisioterapêutico
 *         notes: Paciente apresenta boa evolução
 */

patientAnamnesisRoutes.get("/:patientId/anamnesis", controller.getPatientAnamnesis.bind(controller));
patientAnamnesisRoutes.get("/:patientId/anamnesis/:id", controller.getAnamnesisById.bind(controller));
patientAnamnesisRoutes.post("/:patientId/anamnesis", controller.createAnamnesis.bind(controller));
patientAnamnesisRoutes.put("/:patientId/anamnesis/:id", controller.updateAnamnesis.bind(controller));
patientAnamnesisRoutes.delete("/:patientId/anamnesis/:id", controller.deleteAnamnesis.bind(controller));

export default patientAnamnesisRoutes;