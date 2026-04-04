import { Router } from "express";
import { patientController } from "./controllers/PatientController.js";
import { JwtAuthService } from "../../infrastructure/auth/JwtAuthService.js";
import patientAnamnesisRoutes from "./anamnesis/routes.js";
import patientFinancialRoutes from "./financial/routes.js";
import patientAttachmentRoutes from "./attachments/routes.js";
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
 */
patientRoutes.get("/", (req, res) => patientController.getAll(req, res));
patientRoutes.get("/user/:userId", (req, res) => patientController.getByUserId(req, res));
patientRoutes.get("/:id", (req, res) => patientController.getById(req, res));
patientRoutes.post("/", (req, res) => patientController.create(req, res));
patientRoutes.put("/:id", (req, res) => patientController.update(req, res));
patientRoutes.delete("/:id", (req, res) => patientController.delete(req, res));
// Rotas dos subdomínios dos pacientes
patientRoutes.use("/", patientAnamnesisRoutes);
patientRoutes.use("/", patientFinancialRoutes);
patientRoutes.use("/", patientAttachmentRoutes);
export default patientRoutes;
//# sourceMappingURL=routes.js.map