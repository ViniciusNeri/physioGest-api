import type { Patient } from "../entities/Patient.js";

export interface IPatientRepository {
  /**
   * Busca um paciente pelo ID
   * @param id - ID do paciente
   * @returns Paciente ou null se não encontrado
   */
  findById(id: string): Promise<Patient | null>;

  /**
   * Busca pacientes por userId
   * @param userId - ID do usuário
   * @returns Lista de pacientes
   */
  findByUserId(userId: string): Promise<Patient[]>;

  /**
   * Busca todos os pacientes
   * @returns Lista de pacientes
   */
  findAll(): Promise<Patient[]>;

  /**
   * Cria um novo paciente
   * @param patient - dados do paciente
   * @returns Paciente criado
   */
  create(patient: Patient): Promise<Patient>;

  /**
   * Atualiza um paciente
   * @param id - ID do paciente
   * @param patient - dados atualizados
   * @returns Paciente atualizado ou null se não encontrado
   */
  update(id: string, patient: Partial<Patient>): Promise<Patient | null>;

  /**
   * Deleta um paciente
   * @param id - ID do paciente
   * @returns true se deletado, false se não encontrado
   */
  delete(id: string): Promise<boolean>;

  /**
   * Busca um paciente pelo PIN e userId
   * @param userId - ID do usuário
   * @param pin - PIN do paciente
   * @returns Paciente ou null se não encontrado
   */
  findByPin(userId: string, pin: string): Promise<Patient | null>;

  /**
   * Busca um paciente pelo telefone
   * @param phone - Telefone do paciente (somente números, com DDD)
   * @returns Paciente ou null se não encontrado
   */
  findByPhone(phone: string): Promise<Patient | null>;
}