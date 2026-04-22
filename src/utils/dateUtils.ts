/**
 * dateUtils.ts
 *
 * ESTRATÉGIA DE DATAS - "String Local" (sem UTC / sem offset)
 * ============================================================
 * O sistema armazena datas como STRINGS no formato "YYYY-MM-DDTHH:mm:ss"
 * (sem 'Z', sem offset de timezone).
 *
 * - GRAVAÇÃO: datas são convertidas para horário local de São Paulo e salvas
 *   como string. Ex: frontend envia "2026-04-11T10:00:00-03:00"
 *   → toLocalISOString() → salvo como "2026-04-11T10:00:00" no banco.
 *
 * - LEITURA: datas retornam como strings diretamente do banco.
 *   Não é necessária nenhuma conversão de timezone.
 *
 * - QUERIES: comparação de strings ISO funciona lexicograficamente no MongoDB.
 *   "2026-04-11T10:00:00" >= "2026-04-01T00:00:00" → correto.
 */

const BRASILIA_TIMEZONE = "America/Sao_Paulo";

/**
 * Converte uma data para string ISO local sem offset nem 'Z'.
 * Formato: "YYYY-MM-DDTHH:mm:ss"
 *
 * Uso: chamar SEMPRE antes de salvar uma data no banco.
 * Ex: toLocalISOString(new Date("2026-04-11T10:00:00-03:00"))
 *     → "2026-04-11T10:00:00"
 *
 * @param date - qualquer Date ou string de data
 * @param timezone - timezone de referência (default: America/Sao_Paulo)
 */
export function toLocalISOString(date: Date | string, timezone: string = BRASILIA_TIMEZONE): string {
  if (typeof date === "string" && date.includes('T')) {
    // Detecta se a string já é naive (sem Z e sem offset +/-HH:mm)
    // Se não tiver indicador de fuso, assumimos que o valor nominal é o pretendido.
    const hasTimezone = date.includes('Z') || /([+-]\d{2}:?\d{2})$/.test(date);
    if (!hasTimezone) {
      return date.substring(0, 19).replace(' ', 'T');
    }
  }

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    hourCycle: 'h23',
  };

  const formatter = new Intl.DateTimeFormat('en-CA', options);
  // en-CA produces "YYYY-MM-DD, HH:mm:ss" format
  const parts = formatter.formatToParts(d);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00';

  let hour = get('hour');
  if (hour === '24') hour = '00';

  return `${get('year')}-${get('month')}-${get('day')}T${hour}:${get('minute')}:${get('second')}`;
}

/**
 * Retorna o "Agora" como string local no formato "YYYY-MM-DDTHH:mm:ss".
 * Usado para comparações de "data passada" em validações.
 */
export function getNaiveNowString(timezone: string = BRASILIA_TIMEZONE): string {
  return toLocalISOString(new Date(), timezone);
}

/**
 * Gera o range de string para um dia inteiro: startStr e endStr.
 * Ex: "2026-04-11" → { start: "2026-04-11T00:00:00", end: "2026-04-11T23:59:59" }
 */
export function getLocalDayRange(dateString: string): { start: string; end: string } {
  const [year, month, day] = dateString.split('-').map(s => s.padStart(2, '0'));
  return {
    start: `${year}-${month}-${day}T00:00:00`,
    end: `${year}-${month}-${day}T23:59:59`,
  };
}

/**
 * Gera o range de string para um mês inteiro.
 * Ex: month=4, year=2026 → { start: "2026-04-01T00:00:00", end: "2026-04-30T23:59:59" }
 */
export function getLocalMonthRange(month: number, year: number): { start: string; end: string } {
  const endDay = new Date(year, month, 0).getDate(); // último dia do mês
  const m = month.toString().padStart(2, '0');
  const e = endDay.toString().padStart(2, '0');
  return {
    start: `${year}-${m}-01T00:00:00`,
    end: `${year}-${m}-${e}T23:59:59`,
  };
}

/**
 * Gera o range de string para um ano inteiro.
 */
export function getLocalYearRange(year: number): { start: string; end: string } {
  return {
    start: `${year}-01-01T00:00:00`,
    end: `${year}-12-31T23:59:59`,
  };
}

// ─── Conversores de resposta ──────────────────────────────────────────────────
// Como as datas já estão salvas como string no banco, as funções abaixo
// apenas passam o valor sem transformação.

export function toBrasiliaDateString(date: Date | string | undefined | null): string | undefined {
  if (!date) return undefined;
  if (typeof date === 'string') return date;
  // Fallback para Date legado (dados antigos)
  return toLocalISOString(date);
}

export function convertFinancialDates<T extends {
  date?: any;
  dueDate?: any;
  paymentDate?: any;
  createdAt?: any;
  updatedAt?: any;
}>(record: T): any {
  if (!record) return record;
  return {
    ...record,
    date: record.date ? toBrasiliaDateString(record.date) : record.date,
    dueDate: record.dueDate ? toBrasiliaDateString(record.dueDate) : record.dueDate,
    paymentDate: record.paymentDate ? toBrasiliaDateString(record.paymentDate) : record.paymentDate,
    createdAt: (record as any).createdAt ? toBrasiliaDateString((record as any).createdAt) : (record as any).createdAt,
    updatedAt: (record as any).updatedAt ? toBrasiliaDateString((record as any).updatedAt) : (record as any).updatedAt,
  };
}

export function convertFinancialArrayDates<T extends {
  date?: any;
  dueDate?: any;
  paymentDate?: any;
  createdAt?: any;
  updatedAt?: any;
}>(records: T[]): any[] {
  if (!Array.isArray(records)) return [];
  return records.map(convertFinancialDates);
}

export function convertAgendaDates<T extends {
  startDate?: any;
  endDate?: any;
  date?: any;
  createdAt?: any;
  updatedAt?: any;
}>(record: T): any {
  if (!record) return record;
  return {
    ...record,
    startDate: record.startDate ? toBrasiliaDateString(record.startDate) : record.startDate,
    endDate: record.endDate ? toBrasiliaDateString(record.endDate) : record.endDate,
    date: record.date ? toBrasiliaDateString(record.date) : record.date,
    createdAt: (record as any).createdAt ? toBrasiliaDateString((record as any).createdAt) : (record as any).createdAt,
    updatedAt: (record as any).updatedAt ? toBrasiliaDateString((record as any).updatedAt) : (record as any).updatedAt,
  };
}

export function convertAgendaArrayDates<T extends {
  startDate?: any;
  endDate?: any;
  date?: any;
  createdAt?: any;
  updatedAt?: any;
}>(records: T[]): any[] {
  if (!Array.isArray(records)) return [];
  return records.map(convertAgendaDates);
}

export function convertDashboardDates(data: any): any {
  if (!data) return data;

  if (data.todaysAppointments) {
    data.todaysAppointments = convertAgendaArrayDates(data.todaysAppointments);
  }
  if (data.nextAppointment) {
    data.nextAppointment = convertAgendaDates(data.nextAppointment);
  }
  if (data.birthdayList) {
    data.birthdayList = data.birthdayList.map((p: any) => ({
      ...p,
      birthDate: toBrasiliaDateString(p.birthDate)
    }));
  }
  if (data.pendingPayments) {
    data.pendingPayments = data.pendingPayments.map((p: any) => ({
      ...p,
      date: toBrasiliaDateString(p.date),
      dueDate: p.dueDate ? toBrasiliaDateString(p.dueDate) : p.dueDate
    }));
  }
  if (data.overdueAppointments) {
    data.overdueAppointments = data.overdueAppointments.map((a: any) => ({
      ...a,
      date: toBrasiliaDateString(a.date)
    }));
  }
  return data;
}

// ─── Legacy compat ─────────────────────────────────────────────────────────────
// Mantido para compatibilidade com código que ainda usa getNaiveNow
export function getNaiveNow(timezone: string = BRASILIA_TIMEZONE): Date {
  return new Date(getNaiveNowString(timezone) + 'Z');
}

/** @deprecated use toLocalISOString */
export function toNaiveDate(date: Date, timezone: string = BRASILIA_TIMEZONE): Date {
  return new Date(toLocalISOString(date, timezone) + 'Z');
}
