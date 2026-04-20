import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IWhatsappService } from "../../../domain/services/IWhatsappService.js";

export class WhatsappController {
  private service: IWhatsappService;

  constructor() {
    this.service = container.resolve<IWhatsappService>("IWhatsappService");
  }

  /** GET /v1/whatsapp/perfil/:phone */
  getPerfil = async (req: Request, res: Response) => {
    try {
      const { phone } = req.params;
      const perfil = await this.service.getPerfil(phone as string);
      return res.status(200).json(perfil);
    } catch (error: any) {
      const status = error.statusCode || 500;
      return res.status(status).json({ statusCode: status, message: error.message });
    }
  };

  /** GET /v1/whatsapp/disponibilidade/:categoryId */
  getDisponibilidade = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      const { phone } = req.query;
      const disponibilidade = await this.service.getDisponibilidade(categoryId as string, phone as string | undefined);
      return res.status(200).json(disponibilidade);
    } catch (error: any) {
      const status = error.statusCode || 500;
      return res.status(status).json({ statusCode: status, message: error.message });
    }
  };

  /** POST /v1/whatsapp/agendamentos */
  criarAgendamento = async (req: Request, res: Response) => {
    try {
      const { pacienteId, usuarioId, categoriaId, data, horario } = req.body;
      if (!pacienteId || !usuarioId || !categoriaId || !data || !horario) {
        return res.status(400).json({
          statusCode: 400,
          message: "Todos os campos são obrigatórios: pacienteId, usuarioId, categoriaId, data, horario",
        });
      }
      const agendamento = await this.service.criarAgendamento({ pacienteId, usuarioId, categoriaId, data, horario });
      return res.status(201).json(agendamento);
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json({ statusCode: status, message: error.message });
    }
  };

  /** GET /v1/whatsapp/agendamentos/paciente/:pacienteId */
  listarAgendamentosPaciente = async (req: Request, res: Response) => {
    try {
      const { pacienteId } = req.params;
      const lista = await this.service.listarAgendamentosPaciente(pacienteId as string);
      return res.status(200).json(lista);
    } catch (error: any) {
      const status = error.statusCode || 500;
      return res.status(status).json({ statusCode: status, message: error.message });
    }
  };

  /** PATCH /v1/whatsapp/agendamentos/:agendamentoId/cancelar */
  cancelarAgendamento = async (req: Request, res: Response) => {
    try {
      const { agendamentoId } = req.params;
      const resultado = await this.service.cancelarAgendamento(agendamentoId as string);
      return res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 500;
      return res.status(status).json({ statusCode: status, message: error.message });
    }
  };

  /** PATCH /v1/whatsapp/agendamentos/:agendamentoId/remarcar */
  remarcarAgendamento = async (req: Request, res: Response) => {
    try {
      const { agendamentoId } = req.params;
      const { novaData, novoHorario } = req.body;
      if (!novaData || !novoHorario) {
        return res.status(400).json({ statusCode: 400, message: "novaData e novoHorario são obrigatórios" });
      }
      const resultado = await this.service.remarcarAgendamento(agendamentoId as string, { novaData, novoHorario });
      return res.status(200).json(resultado);
    } catch (error: any) {
      const status = error.statusCode || 500;
      return res.status(status).json({ statusCode: status, message: error.message });
    }
  };
}

export const whatsappController = new WhatsappController();
