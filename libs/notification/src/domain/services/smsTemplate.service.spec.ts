import { Test, TestingModule } from '@nestjs/testing';

import { ErrorResult } from '@app/nest-core/common/utils';
import { SmsTemplateRepository } from '../../infrastructure/repositories/smsTemplate.repository';
import { SmsTemplateService } from './smsTemplate.service';

describe('SmsTemplateService', () => {
  let service: SmsTemplateService;
  let repository: jest.Mocked<SmsTemplateRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsTemplateService,
        {
          provide: SmsTemplateRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            getById: jest.fn(),
            getOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SmsTemplateService>(SmsTemplateService);
    repository = module.get<SmsTemplateRepository>(
      SmsTemplateRepository,
    ) as jest.Mocked<SmsTemplateRepository>;
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock after each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Your tests here
  describe('create', () => {
    it('should create a new SMS template', async () => {
      const input = { label: 'Test Template', content: 'Test Content' };
      const createdTemplate = { _id: '123', ...input };

      repository.create.mockResolvedValue(createdTemplate as any);
      repository.getOne.mockResolvedValue(null); // Simulate a model not found

      const result = await service.create(input);

      expect(result).toEqual(createdTemplate);
      expect(repository.create).toHaveBeenCalledWith(input);
    });

    it('should throw an error if label is not unique', async () => {
      const input = { label: 'Test Template', content: 'Test Content' };
      const existingTemplate = { _id: '456', label: 'Test Template' };

      repository.getOne.mockResolvedValue(existingTemplate as any);

      await expect(service.create(input)).rejects.toThrow(ErrorResult);
      expect(repository.getOne).toHaveBeenCalledWith({
        slug: 'test-template',
      });
    });
  });
});
