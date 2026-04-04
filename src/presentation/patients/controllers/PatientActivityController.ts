import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IPatientActivityService } from "../../../domain/services/IPatientActivityService.js";
import logger from "../../../infrastructure/logging/Logger.js";

class PatientActivityController {
  /**
   * @swagger
   * /patients/{id}/activities:
   *   get:
   *     summary: Busca o histórico de atividades de um paciente
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
   *         description: Histórico de atividades encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/PatientActivity'
   *       400:
   *         description: ID do paciente é obrigatório
   *       500:
   *         description: Erro interno ao buscar histórico
   */
  async getByPatientId(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    logger.debug("Buscando histórico do paciente", { patientId: id });

    if (!id) {
      return res.status(400).json({ message: "ID do paciente é obrigatório" });
    }

    try {
      const service = container.resolve<IPatientActivityService>("IPatientActivityService");
      const activities = await service.getPatientHistory(id as string);
      return res.status(200).json(activities);
    } catch (error) {
      logger.error("Erro ao buscar histórico do paciente", error, { patientId: id });
      return res.status(500).json({ message: "Erro interno ao buscar histórico" });
    }
  }

  /**
   * @swagger
   * /patients/user/{userId}/activities:
   *   get:
   *     summary: Busca o histórico de atividades realizadas por um usuário (profissional)
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
   *         description: Histórico de atividades encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/PatientActivity'
   *       400:
   *         description: ID do usuário é obrigatório
   *       500:
   *         description: Erro interno ao buscar histórico
   */
  async getByUserId(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    logger.debug("Buscando histórico do usuário", { userId });

    if (!userId) {
      return res.status(400).json({ message: "ID do usuário é obrigatório" });
    }

    try {
      const service = container.resolve<IPatientActivityService>("IPatientActivityService");
      const activities = await service.getUserHistory(userId as string);
      return res.status(200).json(activities);
    } catch (error) {
      logger.error("Erro ao buscar histórico do usuário", error, { userId });
      return res.status(500).json({ message: "Erro interno ao buscar histórico" });
    }
  }
}

export const patientActivityController = new PatientActivityController();
