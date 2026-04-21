import { injectable, inject } from "tsyringe";
import { sanitizePhone } from "../../utils/phoneUtils.js";
import type { IWhatsappService, WhatsappPerfilResponse, WhatsappDisponibilidadeResponse, WhatsappCriarAgendamentoInput, WhatsappAgendamentoResponse, WhatsappListaAgendamentosResponse, WhatsappCancelamentoResponse, WhatsappRemarcacaoInput, WhatsappRemarcacaoResponse } from "../../domain/services/IWhatsappService.js";
import type { IUserRepository } from "../../domain/interfaces/IUserRepository.js";
import type { IPatientRepository } from "../../domain/interfaces/IPatientRepository.js";
import type { IAgendaRepository } from "../../domain/interfaces/IAgendaRepository.js";
import type { ICategoryRepository } from "../../domain/interfaces/ICategoryRepository.js";
import type { ISettingRepository } from "../../domain/interfaces/ISettingRepository.js";
import type { WhatsappNotificationService } from "../../infrastructure/external/WhatsappNotificationService.js";

/** Nomes dos dias da semana em português (0=Domingo) */
const DIAS_SEMANA = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];

/** Formata uma data "YYYY-MM-DD" como "DD/MM/YYYY" */
function formatarData(data: string): string {
  const [y, m, d] = data.split('-');
  return `${d}/${m}/${y}`;
}

/** Converte status interno (inglês) para português */
function statusParaPortugues(status: string): string {
  const map: Record<string, string> = {
    scheduled: 'confirmado',
    completed: 'realizado',
    cancelled: 'cancelado',
    no_show: 'falta',
  };
  return map[status] || status;
}

/** Extrai "HH:mm" de um startDate no formato "YYYY-MM-DDTHH:mm:ss" */
function extrairHorario(startDate: string): string {
  return startDate.substring(11, 16);
}

/** Extrai "YYYY-MM-DD" de um startDate no formato "YYYY-MM-DDTHH:mm:ss" */
function extrairData(startDate: string): string {
  return startDate.substring(0, 10);
}

/** Calcula os slots livres de um dia respeitando businessHours, almoço, agendamentos existentes e duração */
function calcularSlotsLivres(params: {
  date: string;
  startTime: string;
  endTime: string;
  lunchStart?: string;
  lunchEnd?: string;
  duration: number;       // duração da sessão em minutos
  gridStep: number;       // passo da grade (sessionDuration) em minutos
  existingAppointments: Array<{ startDate: string; endDate: string }>;
}): string[] {
  const { date, startTime, endTime, lunchStart, lunchEnd, duration, gridStep, existingAppointments } = params;
  const slots: string[] = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    const [h, m] = currentTime.split(':').map(Number);
    const totalEndMin = h * 60 + m + duration;
    const endH = Math.floor(totalEndMin / 60).toString().padStart(2, '0');
    const endM = (totalEndMin % 60).toString().padStart(2, '0');
    const slotEndStr = `${endH}:${endM}`;

    if (slotEndStr > endTime) break;

    const slotStartFull = `${date}T${currentTime}:00`;
    const slotEndFull = `${date}T${slotEndStr}:00`;

    // Verifica conflito com agendamentos existentes
    const hasAppConflict = existingAppointments.some(app =>
      slotStartFull < app.endDate && slotEndFull > app.startDate
    );

    if (!hasAppConflict) {
      // Verifica conflito com horário de almoço
      let isLunchConflict = false;
      if (lunchStart && lunchEnd) {
        if (
          (currentTime >= lunchStart && currentTime < lunchEnd) ||
          (slotEndStr > lunchStart && slotEndStr <= lunchEnd)
        ) {
          isLunchConflict = true;
        }
      }
      if (!isLunchConflict) {
        slots.push(currentTime);
      }
    }

    // Avança para o próximo slot (usando gridStep para manter grade consistente)
    const nextTotalMin = h * 60 + m + gridStep;
    const nextH = Math.floor(nextTotalMin / 60).toString().padStart(2, '0');
    const nextM = (nextTotalMin % 60).toString().padStart(2, '0');
    currentTime = `${nextH}:${nextM}`;
    if (gridStep <= 0) break;
  }

  return slots;
}

@injectable()
export class WhatsappService implements IWhatsappService {
  constructor(
    @inject("IUserRepository")
    private userRepository: IUserRepository,
    @inject("IPatientRepository")
    private patientRepository: IPatientRepository,
    @inject("IAgendaRepository")
    private agendaRepository: IAgendaRepository,
    @inject("ICategoryRepository")
    private categoryRepository: ICategoryRepository,
    @inject("ISettingRepository")
    private settingRepository: ISettingRepository,
    @inject("WhatsappNotificationService")
    private notificationService: WhatsappNotificationService,
  ) { }

  // ─── Endpoint 1 — Buscar Perfil ─────────────────────────────────────────────

  async getPerfil(phone: string): Promise<WhatsappPerfilResponse> {
    const sanitizedPhone = sanitizePhone(phone);
    console.log(`[getPerfil] phone recebido: "${phone}" | sanitizado: "${sanitizedPhone}" | tamanho original: ${phone.length} | tamanho sanitizado: ${sanitizedPhone.length}`);

    // Busca primeiro em usuários
    const user = await this.userRepository.findByPhone(sanitizedPhone);
    console.log(`[getPerfil] resultado findByPhone (usuário):`, user ? `encontrado id=${user.id}` : 'não encontrado');
    if (user) {
      return {
        tipo: 'usuario',
        id: user.id!,
        nome: user.name,
        phone: user.phone,
      };
    }

    // Busca em pacientes (corrigido: usa sanitizedPhone em vez de phone original)
    console.log(`[getPerfil] buscando paciente com phone sanitizado: "${sanitizedPhone}"`);
    const patient = await (this.patientRepository as any).findByPhone(sanitizedPhone);
    console.log(`[getPerfil] resultado findByPhone (paciente):`, patient ? `encontrado id=${patient.id}` : 'não encontrado');
    if (patient) {
      // Busca o usuário responsável
      const responsavel = patient.userId
        ? await this.userRepository.findById(patient.userId)
        : null;

      return {
        tipo: 'paciente',
        id: patient.id!,
        nome: patient.name,
        phone: patient.phone,
        usuario: responsavel
          ? { id: responsavel.id!, nome: responsavel.name }
          : undefined,
      };
    }

    console.log(`[getPerfil] nenhum registro encontrado para "${sanitizedPhone}"`);
    throw Object.assign(new Error('Perfil não encontrado para o telefone informado'), { statusCode: 404 });
  }

  // ─── Endpoint 2 — Disponibilidade ───────────────────────────────────────────

  async getDisponibilidade(categoryId: string, phone?: string): Promise<WhatsappDisponibilidadeResponse> {
    let targetUserId: string | null = null;

    // Se o telefone foi fornecido, buscamos o paciente para identificar o profissional responsável
    if (phone) {
      const sanitizedPhone = sanitizePhone(phone);
      console.log(`[getDisponibilidade] phone recebido: "${phone}" | sanitizado: "${sanitizedPhone}" | tamanho original: ${phone.length} | tamanho sanitizado: ${sanitizedPhone.length}`);
      const patient = await this.patientRepository.findByPhone(sanitizedPhone);
      console.log(`[getDisponibilidade] resultado findByPhone (paciente):`, patient ? `encontrado id=${patient.id}` : 'não encontrado');
      if (!patient) {
        throw Object.assign(new Error('Paciente não encontrado para o telefone informado'), { statusCode: 404 });
      }
      targetUserId = patient.userId;
    }

    // 1. Busca a categoria
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw Object.assign(new Error('Categoria não encontrada'), { statusCode: 404 });
    }

    // 2. Determina o userId final e valida a relação com o paciente (se houver)
    const userId = targetUserId || category.userId;

    if (targetUserId && category.userId && targetUserId !== category.userId) {
      throw Object.assign(new Error('Esta categoria não pertence ao profissional responsável pelo paciente'), { statusCode: 403 });
    }

    if (!userId) {
      throw Object.assign(new Error('Profissional não identificado para esta consulta'), { statusCode: 400 });
    }

    // 3. Busca as configurações do usuário responsável
    const settings = await this.settingRepository.findByUserId(userId);

    if (!settings || !settings.businessHours) {
      throw Object.assign(new Error('Configurações de horário do profissional não encontradas'), { statusCode: 404 });
    }

    const { startTime, endTime, lunchStart, lunchEnd } = settings.businessHours;
    const duration = category.duration || settings.sessionDuration || 60;
    const gridStep = settings.sessionDuration || 60;
    const operatingDays = settings.operatingDays || [1, 2, 3, 4, 5];

    // 3. Itera pelos próximos 30 dias calculando slots
    const disponibilidade: WhatsappDisponibilidadeResponse['disponibilidade'] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const day = new Date(today);
      day.setUTCDate(today.getUTCDate() + i);
      const dateStr = day.toISOString().substring(0, 10); // "YYYY-MM-DD"
      const weekday = new Date(dateStr + 'T12:00:00Z').getUTCDay(); // 0=Dom

      // Verifica se é dia de funcionamento
      if (!operatingDays.includes(weekday)) continue;

      // Busca agendamentos existentes neste dia para este userId
      const rangeStart = `${dateStr}T00:00:00`;
      const rangeEnd = `${dateStr}T23:59:59`;

      const appointments = userId
        ? await this.agendaRepository.findByDateRange(userId, rangeStart, rangeEnd)
        : [];

      const horarios = calcularSlotsLivres({
        date: dateStr,
        startTime,
        endTime,
        lunchStart,
        lunchEnd,
        duration,
        gridStep,
        existingAppointments: appointments,
      });

      if (horarios.length > 0) {
        disponibilidade.push({
          data: dateStr,
          diaSemana: DIAS_SEMANA[weekday],
          horarios,
        });
      }
    }

    return {
      categoria: {
        id: category.id!,
        nome: category.name,
        duracaoMinutos: duration,
      },
      disponibilidade,
    };
  }

  // ─── Endpoint 3 — Criar Agendamento ─────────────────────────────────────────

  async criarAgendamento(input: WhatsappCriarAgendamentoInput): Promise<WhatsappAgendamentoResponse> {
    const { pacienteId, usuarioId, categoriaId, data, horario } = input;

    // Validações de existência
    const [patient, user, category] = await Promise.all([
      this.patientRepository.findById(pacienteId),
      this.userRepository.findById(usuarioId),
      this.categoryRepository.findById(categoriaId),
    ]);

    if (!patient) throw Object.assign(new Error('Paciente não encontrado'), { statusCode: 404 });
    if (!user) throw Object.assign(new Error('Usuário não encontrado'), { statusCode: 404 });
    if (!category) throw Object.assign(new Error('Categoria não encontrada'), { statusCode: 404 });

    // Valida que o paciente pertence ao usuário
    if (patient.userId !== usuarioId) {
      throw Object.assign(new Error('Paciente não está vinculado ao usuário informado'), { statusCode: 400 });
    }

    // Valida que a categoria pertence ao usuário (ou é global)
    if (category.userId !== null && category.userId !== usuarioId) {
      throw Object.assign(new Error('Categoria não pertence ao usuário informado'), { statusCode: 400 });
    }

    // Calcula duração e monta startDate/endDate
    const settings = await this.settingRepository.findByUserId(usuarioId);
    const duration = category.duration || settings?.sessionDuration || 60;

    const [h, m] = horario.split(':').map(Number);
    const endTotalMin = h * 60 + m + duration;
    const endH = Math.floor(endTotalMin / 60).toString().padStart(2, '0');
    const endM = (endTotalMin % 60).toString().padStart(2, '0');

    const startDate = `${data}T${horario}:00`;
    const endDate = `${data}T${endH}:${endM}:00`;

    // Verifica disponibilidade (conflito de horário)
    const hasOverlap = await this.agendaRepository.hasOverlap(usuarioId, pacienteId, startDate, endDate);
    if (hasOverlap) {
      throw Object.assign(new Error('Já existe um agendamento para este horário'), { statusCode: 409 });
    }

    // Cria o agendamento
    const created = await this.agendaRepository.create({
      patientId: pacienteId,
      userId: usuarioId,
      categoryId: categoriaId,
      startDate,
      endDate,
      status: 'scheduled',
      description: 'Agendamento via WhatsApp',
    });

    // TODO: Notificação WhatsApp (ativar com WHATSAPP_NOTIFICATIONS_ENABLED=true)
    if (user.phone) {
      await this.notificationService.notificarNovoAgendamento({
        phoneUsuario: user.phone,
        nomePaciente: patient.name,
        data: formatarData(data),
        horario,
        categoria: category.name,
      }).catch(() => { });
    }

    return {
      id: created.id!,
      paciente: { id: patient.id!, nome: patient.name },
      usuario: { id: user.id!, nome: user.name },
      categoria: { id: category.id!, nome: category.name },
      data,
      horario,
      status: 'confirmado',
      criadoEm: (created as any).createdAt?.toISOString() || new Date().toISOString(),
    };
  }

  // ─── Endpoint 4 — Listar Agendamentos do Paciente ───────────────────────────

  async listarAgendamentosPaciente(pacienteId: string): Promise<WhatsappListaAgendamentosResponse> {
    const patient = await this.patientRepository.findById(pacienteId);
    if (!patient) {
      throw Object.assign(new Error('Paciente não encontrado'), { statusCode: 404 });
    }

    const agendamentos = await this.agendaRepository.findByPatientId(pacienteId);
    const ativos = agendamentos.filter(a => a.status !== 'cancelled');

    return {
      paciente: { id: patient.id!, nome: patient.name },
      agendamentos: ativos.map(a => ({
        id: a.id!,
        categoria: {
          id: a.categoryId || '',
          nome: a.categoryName || (a.category as any)?.name || '',
        },
        data: extrairData(a.startDate),
        horario: extrairHorario(a.startDate),
        status: statusParaPortugues(a.status),
      })),
    };
  }

  // ─── Endpoint 5 — Cancelar Agendamento ──────────────────────────────────────

  async cancelarAgendamento(agendamentoId: string): Promise<WhatsappCancelamentoResponse> {
    const agenda = await this.agendaRepository.findById(agendamentoId);
    if (!agenda) {
      throw Object.assign(new Error('Agendamento não encontrado'), { statusCode: 404 });
    }
    if (agenda.status === 'cancelled') {
      throw Object.assign(new Error('Este agendamento já foi cancelado'), { statusCode: 400 });
    }

    const canceladoEm = new Date().toISOString();
    await this.agendaRepository.update(agendamentoId, {
      status: 'cancelled',
    });

    // TODO: Notificação WhatsApp
    const [user, patient, category] = await Promise.all([
      this.userRepository.findById(agenda.userId),
      this.patientRepository.findById(agenda.patientId),
      agenda.categoryId ? this.categoryRepository.findById(agenda.categoryId) : Promise.resolve(null),
    ]);

    if (user?.phone && patient && category) {
      await this.notificationService.notificarCancelamento({
        phoneUsuario: user.phone,
        nomePaciente: patient.name,
        data: formatarData(extrairData(agenda.startDate)),
        horario: extrairHorario(agenda.startDate),
        categoria: category.name,
      }).catch(() => { });
    }

    return {
      id: agendamentoId,
      status: 'cancelado',
      canceladoEm,
    };
  }

  // ─── Endpoint 6 — Remarcar Agendamento ──────────────────────────────────────

  async remarcarAgendamento(
    agendamentoId: string,
    input: WhatsappRemarcacaoInput
  ): Promise<WhatsappRemarcacaoResponse> {
    const agenda = await this.agendaRepository.findById(agendamentoId);
    if (!agenda) {
      throw Object.assign(new Error('Agendamento não encontrado'), { statusCode: 404 });
    }
    if (agenda.status === 'cancelled') {
      throw Object.assign(new Error('Não é possível remarcar um agendamento cancelado'), { statusCode: 400 });
    }

    const { novaData, novoHorario } = input;

    // Calcula nova duração baseada na categoria
    const category = agenda.categoryId
      ? await this.categoryRepository.findById(agenda.categoryId)
      : null;
    const settings = await this.settingRepository.findByUserId(agenda.userId);
    const duration = category?.duration || settings?.sessionDuration || 60;

    const [h, m] = novoHorario.split(':').map(Number);
    const endTotalMin = h * 60 + m + duration;
    const endH = Math.floor(endTotalMin / 60).toString().padStart(2, '0');
    const endM = (endTotalMin % 60).toString().padStart(2, '0');

    const novoStartDate = `${novaData}T${novoHorario}:00`;
    const novoEndDate = `${novaData}T${endH}:${endM}:00`;

    // Verifica disponibilidade excluindo o próprio agendamento
    const hasOverlap = await this.agendaRepository.hasOverlap(
      agenda.userId,
      agenda.patientId,
      novoStartDate,
      novoEndDate,
      agendamentoId  // exclui o próprio
    );
    if (hasOverlap) {
      throw Object.assign(new Error('O novo horário escolhido não está disponível'), { statusCode: 409 });
    }

    const remarcadoEm = new Date().toISOString();
    await this.agendaRepository.update(agendamentoId, {
      startDate: novoStartDate,
      endDate: novoEndDate,
    });

    // TODO: Notificação WhatsApp
    const [user, patient] = await Promise.all([
      this.userRepository.findById(agenda.userId),
      this.patientRepository.findById(agenda.patientId),
    ]);

    if (user?.phone && patient) {
      await this.notificationService.notificarRemarcacao({
        phoneUsuario: user.phone,
        nomePaciente: patient.name,
        data: formatarData(novaData),
        horario: novoHorario,
        categoria: category?.name || agenda.categoryName || '',
      }).catch(() => { });
    }

    return {
      id: agendamentoId,
      paciente: { id: agenda.patientId, nome: patient?.name || '' },
      categoria: { id: agenda.categoryId || '', nome: category?.name || agenda.categoryName || '' },
      data: novaData,
      horario: novoHorario,
      status: 'confirmado',
      remarcadoEm,
    };
  }
}
