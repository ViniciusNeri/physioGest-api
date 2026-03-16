import type { Patient } from "../entities/Patient.js";

export interface IPatientService {
  /**
   * Busca um paciente pelo ID
   * @param id - ID do paciente
   * @returns Paciente ou null se não encontrado
   */
  getPatientById(id: string): Promise<Patient | null>;

  /**
   * Busca pacientes por userId
   * @param userId - ID do usuário
   * @returns Lista de pacientes
   */
  getPatientsByUserId(userId: string): Promise<Patient[]>;

  /**
   * Busca todos os pacientes
   * @returns Lista de pacientes
   */
  getAllPatients(): Promise<Patient[]>;

  /**
   * Cria um novo paciente
   * @param patient - dados do paciente
   * @returns Paciente criado
   */
  createPatient(patient: Omit<Patient, 'id'>): Promise<Patient>;

  /**
   * Atualiza um paciente
   * @param id - ID do paciente
   * @param patient - dados atualizados
   * @returns Paciente atualizado ou null se não encontrado
   */
  updatePatient(id: string, patient: Partial<Patient>): Promise<Patient | null>;

  /**
   * Deleta um paciente
   * @param id - ID do paciente
   * @returns true se deletado, false se não encontrado
   */
  deletePatient(id: string): Promise<boolean>;
}