// import { UserService } from '../../../../src/application/services/UserService.js';
// import { User } from '../../../../src/domain/entities/Uer.js';  
// import { IUserRepository } from '../../../../src/domain/interfaces/IUserRepository.js';
// import { ILogger } from '../../../../src/infrastructure/logging/Logger.js';

// // Mock das dependências
// const mockUserRepository = {
//   create: jest.fn(),
//   findById: jest.fn(),
//   findByEmail: jest.fn(),
//   findAll: jest.fn(),
//   update: jest.fn(),
//   delete: jest.fn(),
//   findByUserId: jest.fn()
// } as jest.Mocked<IUserRepository>;

// const mockLogger = {
//   info: jest.fn(),
//   error: jest.fn(),
//   warn: jest.fn(),
//   debug: jest.fn()
// } as jest.Mocked<ILogger>;

// describe('UserService', () => {
//   let userService: UserService;

//   beforeEach(() => {
//     // Limpar mocks antes de cada teste
//     jest.clearAllMocks();

//     // Criar instância do serviço com mocks
//     userService = new UserService(mockUserRepository, mockLogger);
//   });

//   describe('createUser', () => {
//     it('should create a user successfully', async () => {
//       const userData = {
//         name: 'João Silva',
//         email: 'joao@example.com',
//         password: 'password123'
//       };

//       const createdUser = {
//         id: 'user123',
//         ...userData,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };

//       mockUserRepository.create.mockResolvedValue(createdUser);

//       const result = await userService.createUser(userData);

//       expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
//       expect(result).toEqual(createdUser);
//       expect(mockLogger.info).toHaveBeenCalledWith('Criando usuário', { email: userData.email });
//     });

//     it('should throw error when user creation fails', async () => {
//       const userData = {
//         name: 'João Silva',
//         email: 'joao@example.com',
//         password: 'password123'
//       };

//       const error = new Error('Database connection failed');
//       mockUserRepository.create.mockRejectedValue(error);

//       await expect(userService.createUser(userData)).rejects.toThrow('Database connection failed');
//       expect(mockLogger.error).toHaveBeenCalled();
//     });
//   });

//   describe('getUserById', () => {
//     it('should return user when found', async () => {
//       const userId = 'user123';
//       const user = {
//         id: userId,
//         name: 'João Silva',
//         email: 'joao@example.com',
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };

//       mockUserRepository.findById.mockResolvedValue(user);

//       const result = await userService.getUserById(userId);

//       expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
//       expect(result).toEqual(user);
//     });

//     it('should return null when user not found', async () => {
//       const userId = 'nonexistent';
//       mockUserRepository.findById.mockResolvedValue(null);

//       const result = await userService.getUserById(userId);

//       expect(result).toBeNull();
//     });
//   });

//   describe('getAllUsers', () => {
//     it('should return all users', async () => {
//       const users = [
//         {
//           id: 'user1',
//           name: 'João Silva',
//           email: 'joao@example.com',
//           createdAt: new Date(),
//           updatedAt: new Date()
//         },
//         {
//           id: 'user2',
//           name: 'Maria Santos',
//           email: 'maria@example.com',
//           createdAt: new Date(),
//           updatedAt: new Date()
//         }
//       ];

//       mockUserRepository.findAll.mockResolvedValue(users);

//       const result = await userService.getAllUsers();

//       expect(mockUserRepository.findAll).toHaveBeenCalled();
//       expect(result).toEqual(users);
//       expect(result).toHaveLength(2);
//     });

//     it('should return empty array when no users exist', async () => {
//       mockUserRepository.findAll.mockResolvedValue([]);

//       const result = await userService.getAllUsers();

//       expect(result).toEqual([]);
//       expect(result).toHaveLength(0);
//     });
//   });

//   describe('updateUser', () => {
//     it('should update user successfully', async () => {
//       const userId = 'user123';
//       const updateData = {
//         name: 'João Silva Atualizado',
//         email: 'joao.atualizado@example.com'
//       };

//       const updatedUser = {
//         id: userId,
//         name: 'João Silva Atualizado',
//         email: 'joao.atualizado@example.com',
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };

//       mockUserRepository.update.mockResolvedValue(updatedUser);

//       const result = await userService.updateUser(userId, updateData);

//       expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
//       expect(result).toEqual(updatedUser);
//     });

//     it('should return null when user to update is not found', async () => {
//       const userId = 'nonexistent';
//       const updateData = { name: 'Novo Nome' };

//       mockUserRepository.update.mockResolvedValue(null);

//       const result = await userService.updateUser(userId, updateData);

//       expect(result).toBeNull();
//     });
//   });

//   describe('deleteUser', () => {
//     it('should delete user successfully', async () => {
//       const userId = 'user123';
//       mockUserRepository.delete.mockResolvedValue(true);

//       const result = await userService.deleteUser(userId);

//       expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
//       expect(result).toBe(true);
//     });

//     it('should return false when user to delete is not found', async () => {
//       const userId = 'nonexistent';
//       mockUserRepository.delete.mockResolvedValue(false);

//       const result = await userService.deleteUser(userId);

//       expect(result).toBe(false);
//     });
//   });
// });