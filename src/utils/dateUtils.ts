const BRASILIA_TIMEZONE = "America/Sao_Paulo";

/**
 * Converte uma data UTC para o fuso horário de Brasília (America/Sao_Paulo).
 * Retorna uma STRING ISO formatada com o offset, evitando que o JSON.stringify reverta para UTC (Z).
 */
export function toBrasiliaDateString(date: Date | string | undefined | null): string | undefined {
  if (!date) return undefined;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return undefined;
  
  // Extrai data e hora usando o fuso de SP
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: BRASILIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // 'sv-SE' retorna no formato: YYYY-MM-DD HH:mm:ss
  const formatted = formatter.format(d).replace(' ', 'T');
  return `${formatted}-03:00`;
}

/**
 * Converte todos os campos de data de um registro PatientFinancial para Brasília.
 * Retorna any casting para contornar a tipagem do typeof Date e expor a String.
 */
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

/**
 * Aplica conversão de timezone em um array de registros financeiros.
 */
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

/**
 * Converte todos os campos de data de um registro Agenda para Brasília.
 */
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

/**
 * Aplica conversão de timezone em um array de registros de agenda ou bloqueio.
 */
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

/**
 * Converte campos de data de um registro de Dashboard
 */
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
