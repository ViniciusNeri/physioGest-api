// import { Patient } from '../../../../src/domain/entities/Patient.js';

// describe('Patient Entity', () => {
//   it('should create a patient with required fields', () => {
//     const patientData = {
//       name: 'João Silva',
//       email: 'joao@example.com',
//       phone: '+55 11 99999-9999',
//       birthDate: new Date('1990-01-01'),
//       userId: 'user123',
//       gender: 'male' as const,
//       profession: 'Engenheiro',
//       observations: 'Paciente ativo'
//     };

//     const patient = new Patient(patientData);

//     expect(patient.name).toBe('João Silva');
//     expect(patient.email).toBe('joao@example.com');
//     expect(patient.phone).toBe('+55 11 99999-9999');
//     expect(patient.birthDate).toEqual(new Date('1990-01-01'));
//     expect(patient.userId).toBe('user123');
//     expect(patient.gender).toBe('male');
//     expect(patient.profession).toBe('Engenheiro');
//     expect(patient.observations).toBe('Paciente ativo');
//   });

//   it('should create a patient with optional fields', () => {
//     const patientData = {
//       name: 'Maria Santos',
//       userId: 'user456'
//     };

//     const patient = new Patient(patientData);

//     expect(patient.name).toBe('Maria Santos');
//     expect(patient.userId).toBe('user456');
//     expect(patient.email).toBeUndefined();
//     expect(patient.phone).toBeUndefined();
//     expect(patient.birthDate).toBeUndefined();
//     expect(patient.gender).toBeUndefined();
//     expect(patient.profession).toBeUndefined();
//     expect(patient.observations).toBeUndefined();
//   });

//   it('should validate gender enum values', () => {
//     const validGenders = ['male', 'female', 'other'] as const;

//     validGenders.forEach(gender => {
//       const patient = new Patient({
//         name: 'Test Patient',
//         userId: 'user123',
//         gender
//       });
//       expect(patient.gender).toBe(gender);
//     });
//   });

//   it('should handle patient data updates', () => {
//     const patient = new Patient({
//       name: 'João Silva',
//       userId: 'user123'
//     });

//     // Simulando atualização de dados
//     const updatedData = {
//       ...patient,
//       profession: 'Médico',
//       observations: 'Atualizado'
//     };

//     const updatedPatient = new Patient(updatedData);

//     expect(updatedPatient.profession).toBe('Médico');
//     expect(updatedPatient.observations).toBe('Atualizado');
//   });
// });