/**
 * Testes unitários para a lógica de cálculo de disponibilidade do WhatsApp.
 *
 * A função `calcularSlotsLivres` é extraída aqui para ser testada de forma isolada,
 * sem dependências de banco de dados ou injeção de dependência.
 */

// ── Função pura extraída da camada de serviço ──────────────────────────────────

function calcularSlotsLivres(params: {
  date: string;
  startTime: string;
  endTime: string;
  lunchStart?: string;
  lunchEnd?: string;
  duration: number;
  gridStep: number;
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

    const hasAppConflict = existingAppointments.some(app =>
      slotStartFull < app.endDate && slotEndFull > app.startDate
    );

    if (!hasAppConflict) {
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

    const nextTotalMin = h * 60 + m + gridStep;
    const nextH = Math.floor(nextTotalMin / 60).toString().padStart(2, '0');
    const nextM = (nextTotalMin % 60).toString().padStart(2, '0');
    currentTime = `${nextH}:${nextM}`;
    if (gridStep <= 0) break;
  }

  return slots;
}

// ── Suíte de testes ────────────────────────────────────────────────────────────

const TEST_DATE = '2025-04-21';

describe('calcularSlotsLivres — Lógica de Disponibilidade WhatsApp', () => {

  describe('Cenários básicos sem agendamentos existentes', () => {
    it('deve retornar todos os slots do expediente quando não há agendamentos', () => {
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '12:00',
        duration: 60,
        gridStep: 60,
        existingAppointments: [],
      });
      expect(slots).toEqual(['08:00', '09:00', '10:00', '11:00']);
    });

    it('deve retornar lista vazia quando expediente é muito curto para uma sessão', () => {
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '08:30',
        duration: 60,
        gridStep: 60,
        existingAppointments: [],
      });
      expect(slots).toEqual([]);
    });

    it('deve respeitar duração da sessão maior que gridStep', () => {
      // Sessão de 90min com grade de 60min → slots deslocados mas considerando duração
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '12:00',
        duration: 90,
        gridStep: 60,
        existingAppointments: [],
      });
      // 08:00 (vai até 09:30) ✓, 09:00 (vai até 10:30) ✓, 10:00 (vai até 11:30) ✓, 11:00 (vai até 12:30) > endTime ✗
      expect(slots).toEqual(['08:00', '09:00', '10:00']);
    });

    it('deve respeitar duração menor (30min) com grid de 30min', () => {
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '10:00',
        duration: 30,
        gridStep: 30,
        existingAppointments: [],
      });
      expect(slots).toEqual(['08:00', '08:30', '09:00', '09:30']);
    });
  });

  describe('Exclusão de horário de almoço', () => {
    it('deve excluir slots que iniciam dentro do almoço', () => {
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '18:00',
        lunchStart: '12:00',
        lunchEnd: '13:00',
        duration: 60,
        gridStep: 60,
        existingAppointments: [],
      });
      expect(slots).not.toContain('12:00');
      expect(slots).toContain('11:00');
      expect(slots).toContain('13:00');
    });

    it('deve excluir slot que termina dentro do almoço', () => {
      // duração de 60min, slot 11:30 terminaria às 12:30 (dentro do almoço 12:00-13:00)
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '18:00',
        lunchStart: '12:00',
        lunchEnd: '13:00',
        duration: 60,
        gridStep: 30,
        existingAppointments: [],
      });
      expect(slots).not.toContain('11:30'); // 11:30-12:30 sobrepõe almoço
      expect(slots).toContain('11:00');     // 11:00-12:00 OK (termina no início do almoço, não incluso)
      expect(slots).toContain('13:00');     // após almoço OK
    });
  });

  describe('Exclusão de agendamentos existentes', () => {
    it('deve excluir um slot ocupado por agendamento existente', () => {
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '12:00',
        duration: 60,
        gridStep: 60,
        existingAppointments: [
          { startDate: `${TEST_DATE}T09:00:00`, endDate: `${TEST_DATE}T10:00:00` },
        ],
      });
      expect(slots).not.toContain('09:00');
      expect(slots).toContain('08:00');
      expect(slots).toContain('10:00');
      expect(slots).toContain('11:00');
    });

    it('deve excluir múltiplos slots quando há mais de um agendamento', () => {
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '12:00',
        duration: 60,
        gridStep: 60,
        existingAppointments: [
          { startDate: `${TEST_DATE}T08:00:00`, endDate: `${TEST_DATE}T09:00:00` },
          { startDate: `${TEST_DATE}T10:00:00`, endDate: `${TEST_DATE}T11:00:00` },
        ],
      });
      expect(slots).not.toContain('08:00');
      expect(slots).not.toContain('10:00');
      expect(slots).toContain('09:00');
      expect(slots).toContain('11:00');
    });

    it('deve excluir slot que se sobrepõe parcialmente a um agendamento', () => {
      // Slot 09:00-10:00, agendamento 09:30-10:30 → conflito
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '12:00',
        duration: 60,
        gridStep: 60,
        existingAppointments: [
          { startDate: `${TEST_DATE}T09:30:00`, endDate: `${TEST_DATE}T10:30:00` },
        ],
      });
      expect(slots).not.toContain('09:00'); // slot 09:00-10:00 conflita com 09:30-10:30
      expect(slots).toContain('08:00');
      expect(slots).toContain('11:00');
    });

    it('deve retornar lista vazia quando todos os slots estão ocupados', () => {
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '10:00',
        duration: 60,
        gridStep: 60,
        existingAppointments: [
          { startDate: `${TEST_DATE}T08:00:00`, endDate: `${TEST_DATE}T09:00:00` },
          { startDate: `${TEST_DATE}T09:00:00`, endDate: `${TEST_DATE}T10:00:00` },
        ],
      });
      expect(slots).toEqual([]);
    });
  });

  describe('Combinação de restrições', () => {
    it('deve aplicar almoço e agendamento existente simultaneamente', () => {
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '18:00',
        lunchStart: '12:00',
        lunchEnd: '13:00',
        duration: 60,
        gridStep: 60,
        existingAppointments: [
          { startDate: `${TEST_DATE}T09:00:00`, endDate: `${TEST_DATE}T10:00:00` },
        ],
      });
      expect(slots).toContain('08:00');
      expect(slots).not.toContain('09:00');  // agendamento existente
      expect(slots).toContain('10:00');
      expect(slots).toContain('11:00');
      expect(slots).not.toContain('12:00');  // almoço
      expect(slots).toContain('13:00');
      expect(slots).toContain('17:00');
    });
  });

  describe('Edge cases', () => {
    it('deve retornar lista vazia quando startTime >= endTime', () => {
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '18:00',
        endTime: '08:00',
        duration: 60,
        gridStep: 60,
        existingAppointments: [],
      });
      expect(slots).toEqual([]);
    });

    it('deve funcionar com expediente sem horário de almoço', () => {
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '12:00',
        duration: 60,
        gridStep: 60,
        existingAppointments: [],
      });
      expect(slots.length).toBe(4);
    });

    it('deve funcionar com sessão de 45 minutos', () => {
      const slots = calcularSlotsLivres({
        date: TEST_DATE,
        startTime: '08:00',
        endTime: '10:00',
        duration: 45,
        gridStep: 45,
        existingAppointments: [],
      });
      // 08:00-08:45, 08:45-09:30, 09:30-10:15>endTime → 2 slots
      expect(slots).toEqual(['08:00', '08:45']);
    });
  });
});
