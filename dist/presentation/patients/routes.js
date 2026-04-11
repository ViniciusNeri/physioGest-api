import { Router } from "express";
import { patientController } from "./controllers/PatientController.js";
import { JwtAuthService } from "../../infrastructure/auth/JwtAuthService.js";
import patientAnamnesisRoutes from "./anamnesis/routes.js";
import patientFinancialRoutes from "./financial/routes.js";
import patientAttachmentRoutes from "./attachments/routes.js";
import { patientActivityController } from "./controllers/PatientActivityController.js";
const patientRoutes = Router();
// Aplica middleware de autenticação em todas as rotas
patientRoutes.use(JwtAuthService.authenticateToken);
/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - name
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do paciente
 *         name:
 *           type: string
 *           description: Nome do paciente
 *         email:
 *           type: string
 *           format: email
 *           description: Email do paciente
 *         phone:
 *           type: string
 *           description: Telefone do paciente
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Data de nascimento do paciente
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Gênero do paciente
 *         profession:
 *           type: string
 *           description: Profissão do paciente
 *         observations:
 *           type: string
 *           description: Observações sobre o paciente
 *         completedAppointments:
 *           type: number
 *           description: Total de agendamentos concluídos
 *         noShowAppointments:
 *           type: number
 *           description: Total de faltas (no_show)
 *         nextAppointmentDate:
 *           type: string
 *           format: date-time
 *           description: Data do próximo agendamento
 *         userId:
 *           type: string
 *           description: ID do usuário associado
 *         pin:
 *           type: string
 *           description: PIN de 4 dígitos para agendamento online
 *         status:
 *           type: boolean
 *           description: Status do paciente (true=ativo, false=inativo)
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         name: Maria Santos
 *         email: maria@example.com
 *         phone: +55 11 99999-9999
 *         birthDate: 1990-01-01
 *         gender: female
 *         profession: Engenheira de Software
 *         observations: Paciente com dores na lombar
 *         userId: 60d5ecb74b24c72b8c8b4568
 *         pin: "1234"
 *         status: true
 *
 *     PatientActivity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da atividade
 *         patientId:
 *           type: string
 *           description: ID do paciente associado
 *         userId:
 *           type: string
 *           description: ID do usuário (profissional) associado
 *         type:
 *           type: string
 *           enum: [appointment_created, appointment_completed, appointment_cancelled, appointment_no_show, payment_pending, payment_paid, anamnesis_updated]
 *           description: Tipo de atividade realizada
 *         description:
 *           type: string
 *           description: Descrição legível da atividade
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora da atividade
 *         metadata:
 *           type: object
 *           description: Dados adicionais variáveis (ex. agendaId, financialId)
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4999
 *         patientId: 60d5ecb74b24c72b8c8b4567
 *         userId: 60d5ecb74b24c72b8c8b4568
 *         type: appointment_completed
 *         description: Atendimento realizado
 *         date: 2026-04-04T10:00:00Z
 *         metadata: { agendaId: "60d5ecb74b24c72b8c8b4111" }
 */
patientRoutes.get("/", (req, res) => patientController.getAll(req, res));
patientRoutes.get("/user/:userId", (req, res) => patientController.getByUserId(req, res));
patientRoutes.get("/:id", (req, res) => patientController.getById(req, res));
patientRoutes.post("/", (req, res) => patientController.create(req, res));
patientRoutes.put("/:id", (req, res) => patientController.update(req, res));
patientRoutes.delete("/:id", (req, res) => patientController.delete(req, res));
// Rotas de Atividades/Histórico
patientRoutes.get("/:id/activities", (req, res) => patientActivityController.getByPatientId(req, res));
patientRoutes.get("/user/:userId/activities", (req, res) => patientActivityController.getByUserId(req, res));
// Rotas dos subdomínios dos pacientes
patientRoutes.use("/", patientAnamnesisRoutes);
patientRoutes.use("/", patientFinancialRoutes);
patientRoutes.use("/", patientAttachmentRoutes);
export default patientRoutes;
//# sourceMappingURL=routes.js.map