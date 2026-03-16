// import request from 'supertest';
// import express from 'express';
// import { UserController } from '../../../src/presentation/user/controllers/UserController.js';
// import { UserService } from '../../../src/application/services/UserService.js';
// import { IUserRepository } from '../../../src/domain/interfaces/IUserRepository.js';
// import { ILogger } from '../../../src/infrastructure/logging/Logger.js';
// import { container } from 'tsyringe';

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

// const mockUserService = {
//   createUser: jest.fn(),
//   getUserById: jest.fn(),
//   getAllUsers: jest.fn(),
//   updateUser: jest.fn(),
//   deleteUser: jest.fn(),
//   authenticateUser: jest.fn()
// } as jest.Mocked<UserService>;

// describe('UserController Integration', () => {
//   let app: express.Application;
//   let userController: UserController;

//   beforeEach(() => {
//     // Limpar mocks
//     jest.clearAllMocks();

//     // Registrar mocks no container
//     container.registerInstance('IUserRepository', mockUserRepository);
//     container.registerInstance('Logger', mockLogger);
//     container.registerInstance('IUserService', mockUserService);

//     // Criar controller
//     userController = new UserController();

//     // Configurar Express app para testes
//     app = express();
//     app.use(express.json());

//     // Middleware de autenticação mockado
//     app.use((req, res, next) => {
//       (req as any).user = { id: 'test-user-id' };
//       next();
//     });

//     // Rotas
//     app.get('/users', (req, res) => userController.getAll(req, res));
//     app.get('/users/:id', (req, res) => userController.getById(req, res));
//     app.post('/users', (req, res) => userController.create(req, res));
//     app.put('/users/:id', (req, res) => userController.update(req, res));
//     app.delete('/users/:id', (req, res) => userController.delete(req, res));
//   });

//   afterEach(() => {
//     container.clearInstances();
//   });

//   describe('GET /users', () => {
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

//       mockUserService.getAllUsers.mockResolvedValue(users);

//       const response = await request(app)
//         .get('/users')
//         .expect(200);

//       expect(response.body).toEqual(users);
//       expect(mockUserService.getAllUsers).toHaveBeenCalled();
//     });

//     it('should handle service errors', async () => {
//       const error = new Error('Database connection failed');
//       mockUserService.getAllUsers.mockRejectedValue(error);

//       const response = await request(app)
//         .get('/users')
//         .expect(500);

//       expect(response.body).toHaveProperty('message', 'Database connection failed');
//     });
//   });

//   describe('GET /users/:id', () => {
//     it('should return user by id', async () => {
//       const user = {
//         id: 'user123',
//         name: 'João Silva',
//         email: 'joao@example.com',
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };

//       mockUserService.getUserById.mockResolvedValue(user);

//       const response = await request(app)
//         .get('/users/user123')
//         .expect(200);

//       expect(response.body).toEqual(user);
//       expect(mockUserService.getUserById).toHaveBeenCalledWith('user123');
//     });

//     it('should return 404 when user not found', async () => {
//       mockUserService.getUserById.mockResolvedValue(null);

//       const response = await request(app)
//         .get('/users/nonexistent')
//         .expect(404);

//       expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
//     });
//   });

//   describe('POST /users', () => {
//     it('should create a new user', async () => {
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

//       mockUserService.createUser.mockResolvedValue(createdUser);

//       const response = await request(app)
//         .post('/users')
//         .send(userData)
//         .expect(201);

//       expect(response.body).toEqual(createdUser);
//       expect(mockUserService.createUser).toHaveBeenCalledWith(userData);
//     });

//     it('should validate required fields', async () => {
//       const invalidData = {
//         email: 'joao@example.com'
//         // missing name
//       };

//       const response = await request(app)
//         .post('/users')
//         .send(invalidData)
//         .expect(400);

//       expect(response.body).toHaveProperty('message');
//     });
//   });

//   describe('PUT /users/:id', () => {
//     it('should update user', async () => {
//       const updateData = {
//         name: 'João Silva Atualizado',
//         email: 'joao.atualizado@example.com'
//       };

//       const updatedUser = {
//         id: 'user123',
//         name: 'João Silva Atualizado',
//         email: 'joao.atualizado@example.com',
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };

//       mockUserService.updateUser.mockResolvedValue(updatedUser);

//       const response = await request(app)
//         .put('/users/user123')
//         .send(updateData)
//         .expect(200);

//       expect(response.body).toEqual(updatedUser);
//       expect(mockUserService.updateUser).toHaveBeenCalledWith('user123', updateData);
//     });

//     it('should return 404 when updating non-existent user', async () => {
//       const updateData = { name: 'Novo Nome' };
//       mockUserService.updateUser.mockResolvedValue(null);

//       const response = await request(app)
//         .put('/users/nonexistent')
//         .send(updateData)
//         .expect(404);

//       expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
//     });
//   });

//   describe('DELETE /users/:id', () => {
//     it('should delete user', async () => {
//       mockUserService.deleteUser.mockResolvedValue(true);

//       const response = await request(app)
//         .delete('/users/user123')
//         .expect(204);

//       expect(response.status).toBe(204);
//       expect(mockUserService.deleteUser).toHaveBeenCalledWith('user123');
//     });

//     it('should return 404 when deleting non-existent user', async () => {
//       mockUserService.deleteUser.mockResolvedValue(false);

//       const response = await request(app)
//         .delete('/users/nonexistent')
//         .expect(404);

//       expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
//     });
//   });
// });