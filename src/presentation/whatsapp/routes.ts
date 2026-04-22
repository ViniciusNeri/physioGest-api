import { Router } from "express";
import { whatsappController } from "./controllers/WhatsappController.js";

const whatsappRoutes = Router();

// Nota: Todos os endpoints deste contexto são públicos (sem JWT).
// São consumidos exclusivamente pelo agente de IA do WhatsApp.

/**
 * @swagger
 * tags:
 *   name: WhatsApp
 *   description: Endpoints exclusivos para o agente de IA do WhatsApp
 */

/**
 * @swagger
 * /whatsapp/perfil/{phone}:
 *   get:
 *     summary: Busca o perfil de um usuário ou paciente pelo número de telefone
 *     tags: [WhatsApp]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: "Número de telefone com DDD, somente números (ex: 5511999998888)"
 *         example: "5511999998888"
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Perfil de Usuário
 *                   properties:
 *                     tipo:
 *                       type: string
 *                       example: usuario
 *                     id:
 *                       type: string
 *                       example: "60d5ecb74b24c72b8c8b4567"
 *                     nome:
 *                       type: string
 *                       example: "João Silva"
 *                     phone:
 *                       type: string
 *                       example: "5511999998888"
 *                 - type: object
 *                   description: Perfil de Paciente
 *                   properties:
 *                     tipo:
 *                       type: string
 *                       example: paciente
 *                     id:
 *                       type: string
 *                       example: "60d5ecb74b24c72b8c8b4568"
 *                     nome:
 *                       type: string
 *                       example: "Maria Santos"
 *                     phone:
 *                       type: string
 *                       example: "5511988887777"
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nome:
 *                           type: string
 *       404:
 *         description: Perfil não encontrado para o telefone informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Perfil não encontrado para o telefone informado"
 */
whatsappRoutes.get("/perfil/:phone", (req, res) => whatsappController.getPerfil(req, res));

/**
 * @swagger
 * /whatsapp/disponibilidade/{categoryId}:
 *   get:
 *     summary: Retorna dias e horários disponíveis para uma categoria nos próximos 30 dias
 *     tags: [WhatsApp]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria de atendimento
 *       - in: query
 *         name: phone
 *         required: false
 *         schema:
 *           type: string
 *         description: "Número de telefone do paciente para identificar o profissional responsável (ex: 5511999998888)"
 *     responses:
 *       200:
 *         description: Disponibilidade calculada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoria:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     duracaoMinutos:
 *                       type: integer
 *                       example: 60
 *                 disponibilidade:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: string
 *                         format: date
 *                         example: "2025-04-21"
 *                       diaSemana:
 *                         type: string
 *                         example: "Segunda-feira"
 *                       horarios:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["08:00", "09:00", "10:00"]
 *             example:
 *               categoria:
 *                 id: "60d5ecb74b24c72b8c8b4570"
 *                 nome: "Fisioterapia"
 *                 duracaoMinutos: 60
 *               disponibilidade:
 *                 - data: "2025-04-21"
 *                   diaSemana: "Segunda-feira"
 *                   horarios: ["08:00", "09:00", "10:00"]
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Categoria não encontrada"
 */
whatsappRoutes.get("/disponibilidade/:categoryId", (req, res) => whatsappController.getDisponibilidade(req, res));

/**
 * @swagger
 * /whatsapp/agendamentos:
 *   post:
 *     summary: Cria um novo agendamento via WhatsApp
 *     tags: [WhatsApp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pacienteId
 *               - usuarioId
 *               - categoriaId
 *               - data
 *               - horario
 *             properties:
 *               pacienteId:
 *                 type: string
 *                 description: ID do paciente
 *               usuarioId:
 *                 type: string
 *                 description: ID do usuário responsável
 *               categoriaId:
 *                 type: string
 *                 description: ID da categoria de atendimento
 *               data:
 *                 type: string
 *                 format: date
 *                 description: Data do agendamento (YYYY-MM-DD)
 *                 example: "2025-04-21"
 *               horario:
 *                 type: string
 *                 description: Horário do agendamento (HH:mm)
 *                 example: "10:00"
 *           example:
 *             pacienteId: "60d5ecb74b24c72b8c8b4568"
 *             usuarioId: "60d5ecb74b24c72b8c8b4567"
 *             categoriaId: "60d5ecb74b24c72b8c8b4570"
 *             data: "2025-04-21"
 *             horario: "10:00"
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 paciente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                 categoria:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                 data:
 *                   type: string
 *                   example: "2025-04-21"
 *                 horario:
 *                   type: string
 *                   example: "10:00"
 *                 status:
 *                   type: string
 *                   example: "confirmado"
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos ou paciente/categoria não pertencem ao usuário
 *       404:
 *         description: Paciente, usuário ou categoria não encontrado
 *       409:
 *         description: Conflito de horário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: "Já existe um agendamento para este horário"
 */
whatsappRoutes.post("/agendamentos", (req, res) => whatsappController.criarAgendamento(req, res));

/**
 * @swagger
 * /whatsapp/agendamentos/paciente/{pacienteId}:
 *   get:
 *     summary: Lista todos os agendamentos ativos de um paciente
 *     tags: [WhatsApp]
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paciente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                 agendamentos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       categoria:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           nome:
 *                             type: string
 *                       data:
 *                         type: string
 *                         example: "2025-04-21"
 *                       horario:
 *                         type: string
 *                         example: "10:00"
 *                       status:
 *                         type: string
 *                         example: "confirmado"
 *       404:
 *         description: Paciente não encontrado
 */
whatsappRoutes.get("/agendamentos/paciente/:pacienteId", (req, res) => whatsappController.listarAgendamentosPaciente(req, res));

/**
 * @swagger
 * /whatsapp/agendamentos/{agendamentoId}/cancelar:
 *   patch:
 *     summary: Cancela um agendamento existente
 *     tags: [WhatsApp]
 *     parameters:
 *       - in: path
 *         name: agendamentoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento a ser cancelado
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "cancelado"
 *                 canceladoEm:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Agendamento já cancelado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Este agendamento já foi cancelado"
 *       404:
 *         description: Agendamento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Agendamento não encontrado"
 */
whatsappRoutes.patch("/agendamentos/:agendamentoId/cancelar", (req, res) => whatsappController.cancelarAgendamento(req, res));

/**
 * @swagger
 * /whatsapp/agendamentos/{agendamentoId}/remarcar:
 *   patch:
 *     summary: Remarca um agendamento para um novo dia e horário
 *     tags: [WhatsApp]
 *     parameters:
 *       - in: path
 *         name: agendamentoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento a ser remarcado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - novaData
 *               - novoHorario
 *             properties:
 *               novaData:
 *                 type: string
 *                 format: date
 *                 description: Nova data (YYYY-MM-DD)
 *                 example: "2025-04-23"
 *               novoHorario:
 *                 type: string
 *                 description: Novo horário (HH:mm)
 *                 example: "09:00"
 *           example:
 *             novaData: "2025-04-23"
 *             novoHorario: "09:00"
 *     responses:
 *       200:
 *         description: Agendamento remarcado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 paciente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                 categoria:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                 data:
 *                   type: string
 *                   example: "2025-04-23"
 *                 horario:
 *                   type: string
 *                   example: "09:00"
 *                 status:
 *                   type: string
 *                   example: "confirmado"
 *                 remarcadoEm:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Agendamento cancelado ou dados inválidos
 *       404:
 *         description: Agendamento não encontrado
 *       409:
 *         description: Novo horário não está disponível
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: "O novo horário escolhido não está disponível"
 */
whatsappRoutes.patch("/agendamentos/:agendamentoId/remarcar", (req, res) => whatsappController.remarcarAgendamento(req, res));

/**
 * @swagger
 * /whatsapp/agendamentos/proximas-24h:
 *   get:
 *     summary: Retorna todos os agendamentos do sistema previstos para as próximas 24 horas
 *     tags: [WhatsApp]
 *     responses:
 *       200:
 *         description: Lista de agendamentos das próximas 24 horas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   agendamentoId:
 *                     type: string
 *                   pacienteId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   nomePaciente:
 *                     type: string
 *                   phone:
 *                     type: string
 *                     example: "5571999999999"
 *                   nomeUsuario:
 *                     type: string
 *                   categoria:
 *                     type: string
 *                   data:
 *                     type: string
 *                     example: "2025-04-23"
 *                   horario:
 *                     type: string
 *                     example: "09:00"
 */
whatsappRoutes.get("/agendamentos/proximas-24h", (req, res) => whatsappController.listarAgendamentosProximas24h(req, res));

export default whatsappRoutes;
