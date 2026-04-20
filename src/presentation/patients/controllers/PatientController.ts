import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IPatientService } from "../../../domain/services/IPatientService.js";
import type { ILogger } from "../../../infrastructure/logging/Logger.js";

export class PatientController {
  private service: IPatientService;
  private logger: ILogger;

  constructor() {
    this.service = container.resolve<IPatientService>("IPatientService");
    this.logger = container.resolve<ILogger>("Logger");
  }

  /**
   * @swagger
   * /patients:
   *   get:
   *     summary: Lista todos os pacientes
   *     tags: [Patients]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de pacientes
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Patient'
   *       500:
   *         description: Erro interno do servidor
   */
  getAll = async (req: Request, res: Response) => {
    try {
      this.logger.info("Listando todos os pacientes");
      const patients = await this.service.getAllPatients();
      return res.status(200).json(patients);
    } catch (error: any) {
      this.logger.error("Erro ao listar pacientes", error);
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/user/{userId}:
   *   get:
   *     summary: Lista pacientes por usuário
   *     tags: [Patients]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do usuário
   *     responses:
   *       200:
   *         description: Lista de pacientes
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Patient'
   *       500:
   *         description: Erro interno do servidor
   */
  getByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: "userId é obrigatório" });
      }
      this.logger.info(`Listando pacientes por userId: ${userId}`);
      const patients = await this.service.getPatientsByUserId(userId as string);
      return res.status(200).json(patients);
    } catch (error: any) {
      this.logger.error("Erro ao listar pacientes por userId", error);
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{id}:
   *   get:
   *     summary: Busca um paciente por ID
   *     tags: [Patients]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do paciente
   *     responses:
   *       200:
   *         description: Paciente encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Patient'
   *       404:
   *         description: Paciente não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID é obrigatório" });
      }
      this.logger.info(`Buscando paciente por ID: ${id}`);
      const patient = await this.service.getPatientById(id as string);
      if (!patient) {
        return res.status(404).json({ message: "Paciente não encontrado" });
      }
      return res.status(200).json(patient);
    } catch (error: any) {
      this.logger.error("Erro ao buscar paciente", error);
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients:
   *   post:
   *     summary: Cria um novo paciente
   *     tags: [Patients]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - userId
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               phone:
   *                 type: string
   *               birthDate:
   *                 type: string
   *                 format: date
   *               gender:
   *                 type: string
   *                 enum: [male, female, other]
   *               profession:
   *                 type: string
   *               observations:
   *                 type: string
   *               userId:
   *                 type: string
   *     responses:
   *       201:
   *         description: Paciente criado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Patient'
   *       400:
   *         description: Dados inválidos
   *       500:
   *         description: Erro interno do servidor
   */
  create = async (req: Request, res: Response) => {
    try {
      const { name, email, phone, birthDate, gender, profession, observations, userId } = req.body;
      this.logger.info(`Criando paciente: ${name} para userId: ${userId}`);
      const patient = await this.service.createPatient(req.body);
      return res.status(201).json(patient);
      return res.status(201).json(patient);
    } catch (error: any) {
      this.logger.error("Erro ao criar paciente", error);
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{id}:
   *   put:
   *     summary: Atualiza um paciente
   *     tags: [Patients]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do paciente
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               phone:
   *                 type: string
   *               birthDate:
   *                 type: string
   *                 format: date
   *               gender:
   *                 type: string
   *                 enum: [male, female, other]
   *               profession:
   *                 type: string
   *               observations:
   *                 type: string
   *     responses:
   *       200:
   *         description: Paciente atualizado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Patient'
   *       404:
   *         description: Paciente não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID é obrigatório" });
      }
      const updates = req.body;
      this.logger.info(`Atualizando paciente: ${id}`);
      const patient = await this.service.updatePatient(id as string, updates);
      if (!patient) {
        return res.status(404).json({ message: "Paciente não encontrado" });
      }
      return res.status(200).json(patient);
    } catch (error: any) {
      this.logger.error("Erro ao atualizar paciente", error);
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /patients/{id}:
   *   delete:
   *     summary: Deleta um paciente
   *     tags: [Patients]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do paciente
   *     responses:
   *       200:
   *         description: Paciente deletado
   *       404:
   *         description: Paciente não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID é obrigatório" });
      }
      this.logger.info(`Deletando paciente: ${id}`);
      const deleted = await this.service.deletePatient(id as string);
      if (!deleted) {
        return res.status(404).json({ message: "Paciente não encontrado" });
      }
      return res.status(200).json({ message: "Paciente deletado com sucesso" });
    } catch (error: any) {
      this.logger.error("Erro ao deletar paciente", error);
      return res.status(500).json({ message: error.message });
    }
  }
}

export const patientController = new PatientController();