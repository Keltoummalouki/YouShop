import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            createUser: jest.fn().mockResolvedValue({
              id: 1,
              email: 'test@example.com',
              password: 'hashed',
              role: 'CLIENT',
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('handleUserCreate', () => {
    it('should create a user', async () => {
      const result = await appController.handleUserCreate({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        password: 'hashed',
        role: 'CLIENT',
      });
    });
  });
});
