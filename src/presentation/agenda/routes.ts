import { Router } from "express";
import { agendaController } from "./controllers/AgendaController.js";
import { JwtAuthService } from "../../infrastructure/auth/JwtAuthService.js";

const agendaRoutes = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Agenda:
 *       type: object
 *       required:
 *         - patientId
 *         - userId
 *         - startDate
 *         - endDate
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do agendamento
 *         patientId:
 *           type: string
 *           description: ID do paciente
 *         patientName:
 *           type: string
 *           description: Nome do paciente
 *         userId:
 *           type: string
 *           description: ID do profissional
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Data e hora de início
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Data e hora de fim
 *         status:
 *           type: string
 *           enum: [scheduled, completed, cancelled, no_show]
 *           description: Status do agendamento
 *         categoryId:
 *           type: string
 *           description: ID da categoria de atendimento
 *         description:
 *           type: string
 *           description: Observações sobre o agendamento
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         patientId: 60d5ecb74b24c72b8c8b4568
 *         patientName: Maria Santos
 *         userId: 60d5ecb74b24c72b8c8b4569
 *         startDate: "2026-04-06T10:00:00-03:00"
 *         endDate: "2026-04-06T11:00:00-03:00"
 *         status: scheduled
 *         categoryId: 60d5ecb74b24c72b8c8b4570
 *         description: Primeira consulta
 *
 *     AgendaLock:
 *       type: object
 *       required:
 *         - userId
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do bloqueio
 *         userId:
 *           type: string
 *           description: ID do profissional
 *         type:
 *           type: string
 *           enum: [total, partial]
 *           description: Tipo do bloqueio (total=dia inteiro, partial=período específico)
 *         date:
 *           type: string
 *           format: date
 *           description: Data do bloqueio (enviar se for apenas um dia)
 *         dates:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *           description: Lista de datas para bloqueio em lote (opcional)
 *         startTime:
 *           type: string
 *           description: Hora de início (apenas para bloqueio parcial) ex. "08:00"
 *         endTime:
 *           type: string
 *           description: Hora de fim (apenas para bloqueio parcial) ex. "12:00"
 *         description:
 *           type: string
 *           description: Motivo do bloqueio
 *       example:
 *         userId: 60d5ecb74b24c72b8c8b4569
 *         type: partial
 *         dates: ["2026-04-10", "2026-04-11"]
 *         startTime: "08:00"
 *         endTime: "12:00"
 *         description: Reunião matinal
 */

/**
 * @swagger
 * /agendas/online:
 *   post:
 *     summary: Realiza agendamento online pelo paciente via PIN (Público)
 *     tags: [Agendas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - pin
 *               - startDate
 *               - categoryId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID do profissional
 *               pin:
 *                 type: string
 *                 description: PIN de 4 dígitos do paciente
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora do agendamento
 *               categoryId:
 *                 type: string
 *                 description: ID da categoria de atendimento
 *           example:
 *             userId: 60d5ecb74b24c72b8c8b4569
 *             pin: "1234"
 *             startDate: "2026-04-10T14:00:00-03:00"
 *             categoryId: 60d5ecb74b24c72b8c8b4570
 *     responses:
 *       201:
 *         description: Agendamento realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agenda'
 *       400:
 *         description: Dados inválidos, PIN incorreto ou horário indisponível
 *       404:
 *         description: Profissional ou paciente não encontrado
 */
agendaRoutes.post("/online", (req, res) => agendaController.createOnline(req, res));

/**
 * @swagger
 * /agendas/available-slots:
 *   get:
 *     summary: Retorna horários disponíveis por profissional e data
 *     tags: [Agendas]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do profissional
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data desejada (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de horários disponíveis (ex. ["08:00", "09:00"])
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Parâmetros ausentes ou inválidos
 *       404:
 *         description: Configurações do profissional não encontradas
 */
agendaRoutes.get("/available-slots", (req, res) => agendaController.getAvailableSlots(req, res));

// Middleware de autenticação para as demais rotas (uso profissional)
agendaRoutes.use(JwtAuthService.authenticateToken);

/**
 * @swagger
 * /agendas:
 *   get:
 *     summary: Lista todos os agendamentos
 *     tags: [Agendas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agenda'
 *       401:
 *         description: Não autorizado
 */
agendaRoutes.get("/", (req, res) => agendaController.getAll(req, res));

/**
 * @swagger
 * /agendas/user/{userId}:
 *   get:
 *     summary: Lista apenas os agendamentos por profissional
 *     tags: [Agendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agenda'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Profissional não encontrado
 */
agendaRoutes.get("/user/:userId", (req, res) => agendaController.getAppointmentsByUserId(req, res));



/**
 * @swagger
 * /agendas/user/{userId}/locks:
 *   get:
 *     summary: Lista apenas os bloqueios de agenda por profissional (sem agendamentos)
 *     tags: [Agendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Lista de bloqueios retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AgendaLock'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Profissional não encontrado
 */
agendaRoutes.get("/user/:userId/locks", (req, res) => agendaController.getLocksByUserId(req, res));


/**
 * @swagger
 * /agendas/patient/{patientId}:
 *   get:
 *     summary: Lista agendamentos por paciente
 *     tags: [Agendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Lista de agendamentos do paciente retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agenda'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Paciente não encontrado
 */
agendaRoutes.get("/patient/:patientId", (req, res) => agendaController.getByPatientId(req, res));

/**
 * @swagger
 * /agendas/{id}:
 *   get:
 *     summary: Busca um agendamento por ID
 *     tags: [Agendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agenda'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Agendamento não encontrado
 */
agendaRoutes.get("/:id", (req, res) => agendaController.getById(req, res));

/**
 * @swagger
 * /agendas:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Agendas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agenda'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agenda'
 *       400:
 *         description: Dados inválidos ou conflito de horário
 *       401:
 *         description: Não autorizado
 */
agendaRoutes.post("/", (req, res) => agendaController.create(req, res));

/**
 * @swagger
 * /agendas/{id}:
 *   put:
 *     summary: Atualiza um agendamento
 *     tags: [Agendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agenda'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agenda'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Agendamento não encontrado
 */
agendaRoutes.put("/:id", (req, res) => agendaController.update(req, res));

/**
 * @swagger
 * /agendas/{id}:
 *   delete:
 *     summary: Remove um agendamento
 *     tags: [Agendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Agendamento não encontrado
 */
agendaRoutes.delete("/:id", (req, res) => agendaController.delete(req, res));

/**
 * @swagger
 * /agendas/lock:
 *   post:
 *     summary: Cria um bloqueio de agenda (total ou parcial)
 *     tags: [Agendas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendaLock'
 *     responses:
 *       201:
 *         description: Bloqueios criados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AgendaLock'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
agendaRoutes.post("/lock", (req, res) => agendaController.createLock(req, res));

/**
 * @swagger
 * /agendas/lock/{id}:
 *   delete:
 *     summary: Remove um bloqueio de agenda
 *     tags: [Agendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloqueio
 *     responses:
 *       200:
 *         description: Bloqueio removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Bloqueio não encontrado
 */
agendaRoutes.delete("/lock/:id", (req, res) => agendaController.deleteLock(req, res));

export default agendaRoutes;