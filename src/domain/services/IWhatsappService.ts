export interface WhatsappPerfilResponse {
  tipo: 'usuario' | 'paciente';
  id: string;
  nome: string;
  phone: string;
  usuario?: { id: string; nome: string };
}

export interface WhatsappSlotDia {
  data: string;          // "YYYY-MM-DD"
  diaSemana: string;     // "Segunda-feira"
  horarios: string[];    // ["08:00", "09:00"]
}

export interface WhatsappDisponibilidadeResponse {
  categoria: { id: string; nome: string; duracaoMinutos: number };
  disponibilidade: WhatsappSlotDia[];
}

export interface WhatsappCriarAgendamentoInput {
  pacienteId: string;
  usuarioId: string;
  categoriaId: string;
  data: string;     // "YYYY-MM-DD"
  horario: string;  // "HH:mm"
}

export interface WhatsappAgendamentoResponse {
  id: string;
  paciente: { id: string; nome: string };
  usuario: { id: string; nome: string };
  categoria: { id: string; nome: string };
  data: string;
  horario: string;
  status: string;
  criadoEm: string;
}

export interface WhatsappListaAgendamentosResponse {
  paciente: { id: string; nome: string };
  agendamentos: Array<{
    id: string;
    categoria: { id: string; nome: string };
    data: string;
    horario: string;
    status: string;
  }>;
}

export interface WhatsappCancelamentoResponse {
  id: string;
  status: string;
  canceladoEm: string;
}

export interface WhatsappRemarcacaoInput {
  novaData: string;
  novoHorario: string;
}

export interface WhatsappRemarcacaoResponse {
  id: string;
  paciente: { id: string; nome: string };
  categoria: { id: string; nome: string };
  data: string;
  horario: string;
  status: string;
  remarcadoEm: string;
}

export interface IWhatsappService {
  getPerfil(phone: string): Promise<WhatsappPerfilResponse>;

  getDisponibilidade(categoryId: string, phone?: string): Promise<WhatsappDisponibilidadeResponse>;

  criarAgendamento(data: WhatsappCriarAgendamentoInput): Promise<WhatsappAgendamentoResponse>;

  listarAgendamentosPaciente(pacienteId: string): Promise<WhatsappListaAgendamentosResponse>;

  cancelarAgendamento(agendamentoId: string): Promise<WhatsappCancelamentoResponse>;

  remarcarAgendamento(
    agendamentoId: string,
    input: WhatsappRemarcacaoInput
  ): Promise<WhatsappRemarcacaoResponse>;

  listarAgendamentosProximas24h(): Promise<any[]>;
}
