import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { ErrorResult } from '@app/nest-core/common/utils';
import { EmailTemplate } from '../../infrastructure/models/emailTemplate';
import { EmailTemplateRepository } from '../../infrastructure/repositories/emailTemplate.repository';
import { EmailTemplateService } from './emailTemplate.service';

// Mock the Mongoose model to avoid using a real database
// Why? To keep tests isolated and fast
const emailTemplateModelMock = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  updateOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

// Repository mock - abstraction layer above the model
// We simulate all methods that we'll use
const emailTemplateRepositoryMock = {
  create: jest.fn(),
  update: jest.fn(),
  getOne: jest.fn(),
  getById: jest.fn(),
};

describe('EmailTemplateService', () => {
  let service: EmailTemplateService;
  let repository: jest.Mocked<EmailTemplateRepository>;

  // Before each test, we set up our environment
  beforeEach(async () => {
    // Configure the test module with our mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailTemplateService, // The service being tested
        {
          provide: EmailTemplateRepository,
          useValue: emailTemplateRepositoryMock, // Inject the repository mock
        },
        {
          provide: getModelToken(EmailTemplate.name),
          useValue: emailTemplateModelMock, // Inject the model mock
        },
      ],
    }).compile();

    // Get instances for our tests
    service = module.get<EmailTemplateService>(EmailTemplateService);
    repository = module.get<EmailTemplateRepository>(
      EmailTemplateRepository,
    ) as jest.Mocked<EmailTemplateRepository>;
  });

  // After each test, we clean up the mocks
  // Why? To prevent calls from one test affecting the next one
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Basic test: does the service exist?
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests for the create() method
  describe('create', () => {
    // Test for the nominal case: successful creation
    it('should create a new email template', async () => {
      // Prepare test data
      const input = {
        slug: 'test-template',
        label: 'Test Template',
        subject: 'Test Subject',
        message: 'Test Message',
        description: 'Test Description',
        template: '<p>Test Template</p>',
      };

      // Simulate expected result after creation
      const createdTemplate = {
        _id: '65f8f8f8f8f8f8f8f8f8f8f8',
        ...input,
        active: true,
        deleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Configure the mock to return our template
      repository.create.mockResolvedValue(createdTemplate as any);

      // Execute the test
      const result = await service.create(input);

      // Verifications
      expect(result).toEqual(createdTemplate); // Is the result correct?
      expect(repository.create).toHaveBeenCalledWith(input); // Was the method called with the right parameters?
    });

    // Test for error case: template with existing label
    it('should throw an error if label is not unique', async () => {
      // Prepare test data
      const input = {
        slug: 'test-template',
        label: 'Test Template',
        subject: 'Test Subject',
        message: 'Test Message',
        description: 'Test Description',
        template: '<p>Test Template</p>',
      };

      // Simulate an existing template
      repository.getOne.mockResolvedValue({
        _id: '65f8f8f8f8f8f8f8f8f8f8f8',
        ...input,
      } as any);

      // Verify that creation fails with an error
      await expect(service.create(input)).rejects.toThrow(ErrorResult);
      // Verify that the search was done with the correct slug
      expect(repository.getOne).toHaveBeenCalledWith({
        slug: 'test-template',
      });
    });
  });
});
