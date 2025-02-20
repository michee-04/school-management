import { Test, TestingModule } from '@nestjs/testing';

import { UserNotificationRepository } from '../../infrastructure/repositories/userNotification.repository';
import { UserNotificationService } from './userNotification.service';

describe('UserNotificationService', () => {
  let service: UserNotificationService;
  let repository: jest.Mocked<UserNotificationRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserNotificationService,
        {
          provide: UserNotificationRepository,
          useValue: {
            get: jest.fn(),
            getAll: jest.fn(),
            getActiveById: jest.fn(),
            getActiveByIdAndUser: jest.fn(),
            update: jest.fn(),
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserNotificationService>(UserNotificationService);
    repository = module.get<UserNotificationRepository>(
      UserNotificationRepository,
    ) as jest.Mocked<UserNotificationRepository>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllByUserPaginated', () => {
    it('should return paginated notifications for a user', async () => {
      const userId = '123';
      const limit = 10;
      const skip = 0;
      const notifications = [
        { _id: '1', userId, message: 'Notification 1' },
        { _id: '2', userId, message: 'Notification 2' },
      ];

      repository.get.mockResolvedValue(notifications as any);

      const result = await service.getAllByUserPaginated(userId, limit, skip);

      expect(result).toEqual(notifications);
      expect(repository.get).toHaveBeenCalledWith(
        { userId, active: true, deleted: false },
        limit,
        skip,
        { createdAt: -1 },
      );
    });
  });
});
