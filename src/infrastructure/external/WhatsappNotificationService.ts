import { injectable } from "tsyringe";

/**
 * WhatsappNotificationService
 *
 * Serviço isolado para envio de notificações via WhatsApp (uazapi).
 * Controlado pela variável de ambiente WHATSAPP_NOTIFICATIONS_ENABLED=true.
 *
 * TODO: Implementar as chamadas HTTP para a API uazapi quando disponível.
 *       Ativar via WHATSAPP_NOTIFICATIONS_ENABLED=true no .env.
 */
@injectable()
export class WhatsappNotificationService {
  private readonly enabled: boolean;
  private readonly apiUrl: string;
  private readonly apiToken: string;

  constructor() {
    this.enabled = process.env.WHATSAPP_NOTIFICATIONS_ENABLED === 'true';
    this.apiUrl = process.env.UAZAPI_URL || '';
    this.apiToken = process.env.UAZAPI_TOKEN || '';
  }

  /**
   * Envia uma mensagem de texto via WhatsApp para um número de telefone.
   * @param phone - Número de telefone com DDD (ex: 5511999998888)
   * @param message - Texto da mensagem
   */
  async sendMessage(phone: string, message: string): Promise<void> {
    // if (!this.enabled) {
    //   console.info(`[WhatsappNotification] (desativado) Para: ${phone} | Mensagem: ${message}`);
    //   return;
    // }

    if (!this.apiUrl || !this.apiToken) {
      console.warn('[WhatsappNotification] UAZAPI_URL ou UAZAPI_TOKEN não configurados.');
      return;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token': this.apiToken,
        },
        body: JSON.stringify({
          number: phone,
          text: message,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Falha ao enviar mensagem WhatsApp: ${response.status} ${response.statusText} - ${errorText}`);
      }

      console.info(`[WhatsappNotification] Mensagem enviada para ${phone}`);
    } catch (error) {
      console.error(`[WhatsappNotification] Erro ao enviar mensagem para ${phone}:`, error);
    }
  }

  /**
   * Notifica o usuário responsável sobre um novo agendamento via WhatsApp.
   */
  async notificarNovoAgendamento(params: {
    phoneUsuario: string;
    nomePaciente: string;
    data: string;      // "DD/MM/YYYY"
    horario: string;   // "HH:MM"
    categoria: string;
  }): Promise<void> {
    const message =
      `Olá! O paciente *${params.nomePaciente}* realizou um agendamento para o dia ` +
      `*${params.data}* às *${params.horario}* — Categoria: *${params.categoria}*.`;
    await this.sendMessage(params.phoneUsuario, message);
  }

  /**
   * Notifica o usuário responsável sobre um cancelamento via WhatsApp.
   */
  async notificarCancelamento(params: {
    phoneUsuario: string;
    nomePaciente: string;
    data: string;
    horario: string;
    categoria: string;
  }): Promise<void> {
    const message =
      `Atenção! O agendamento do paciente *${params.nomePaciente}* previsto para ` +
      `*${params.data}* às *${params.horario}* — Categoria: *${params.categoria}* foi *cancelado*.`;
    await this.sendMessage(params.phoneUsuario, message);
  }

  /**
   * Notifica o usuário responsável sobre uma remarcação via WhatsApp.
   */
  async notificarRemarcacao(params: {
    phoneUsuario: string;
    nomePaciente: string;
    data: string;
    horario: string;
    categoria: string;
  }): Promise<void> {
    const message =
      `O agendamento do paciente *${params.nomePaciente}* foi *remarcado* para o dia ` +
      `*${params.data}* às *${params.horario}* — Categoria: *${params.categoria}*.`;
    await this.sendMessage(params.phoneUsuario, message);
  }

  /**
   * Envia mensagem de boas-vindas para um novo profissional (usuário).
   */
  async notificarBoasVindasUsuario(params: {
    phone: string;
    nome: string;
  }): Promise<void> {
    const message =
      `Olá, *${params.nome}*! 👋 Bem-vindo ao *PhysioGest*! 🚀\n\n` +
      `Aqui você poderá gerenciar sua clínica, agendar pacientes, controlar o financeiro e muito mais.\n\n` +
      `Eu sou seu *Assistente Virtual* e estou aqui para automatizar seu atendimento e facilitar seu dia a dia! 😊`;
    await this.sendMessage(params.phone, message);
  }

  /**
   * Envia mensagem de boas-vindas para um novo paciente.
   */
  async notificarBoasVindasPaciente(params: {
    phone: string;
    nomePaciente: string;
    nomeUsuario: string;
  }): Promise<void> {
    const message =
      `Olá, *${params.nomePaciente}*! 👋\n\n` +
      `O(A) profissional *${params.nomeUsuario}* acaba de cadastrar você no sistema *PhysioGest*. 😊\n\n` +
      `Eu sou um *Assistente Virtual* e por aqui você poderá:\n` +
      `✅ *Realizar agendamentos*\n` +
      `✅ *Confirmar horários*\n` +
      `✅ *Cancelar consultas*\n` +
      `✅ *Remarcar atendimentos*\n\n` +
      `Estou à sua disposição para o que precisar! 🚀`;
    await this.sendMessage(params.phone, message);
  }
}
