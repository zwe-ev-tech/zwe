import { Test, TestingModule } from '@nestjs/testing';
import { OpenApiService } from '../open-api/services/open-api.service';
import { S3Service } from '../file/services/s3.service';
import { OpenAI } from 'openai';

// Define your mocks
const mockS3Service = {
  getSignedUrl: jest.fn(),
};

const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
};

describe('OpenApiService.extractReceiptDetails', () => {
  let service: OpenApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OpenApiService,
          useFactory: (config, s3Config, s3Service) => {
            return new OpenApiService(config, s3Config, s3Service, mockOpenAI as unknown as OpenAI);
          },
          inject: ['OPEN_AI_CONFIG', 'S3_CONFIG', S3Service],
        },
        { provide: 'OPEN_AI_CONFIG', useValue: { key: 'test-key' } },
        { provide: 'S3_CONFIG', useValue: { region: 'ap-southeast-1', bucket: 'test-bucket' } },
        { provide: S3Service, useValue: mockS3Service },
      ],
    }).compile();

    service = module.get<OpenApiService>(OpenApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully extract receipt details from a valid image', async () => {
    const fileKey = 'test-image.jpg';
    const signedUrl = 'https://signed-url.com/test-image.jpg';

    const mockContent = `\`\`\`json
    {
      "vendorName": "Lorem Ipsum",
      "receiptDate": "2018-01-01",
      "currency": "SGD",
      "total": 84.8,
      "items": [
        { "itemName": "Item 1", "itemCost": 10.0 },
        { "itemName": "Item 2", "itemCost": 20.0 }
      ]
    }
    \`\`\``;

    mockS3Service.getSignedUrl.mockResolvedValue(signedUrl);
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: mockContent } }],
    });

    const result = await service.extractReceiptDetails(fileKey);

    expect(result.vendorName).toBe('Lorem Ipsum');
    expect(mockS3Service.getSignedUrl).toHaveBeenCalledWith(fileKey);
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
  });

  it('should throw an error for invalid AI model response', async () => {
    mockS3Service.getSignedUrl.mockResolvedValue('https://url');
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: '' } }],
    });

    await expect(service.extractReceiptDetails('file.jpg')).rejects.toThrow('Invalid or empty AI model response');
  });

  it('should throw an error if OpenAI call fails', async () => {
    mockS3Service.getSignedUrl.mockResolvedValue('https://signed-url.com/test.jpg');
    mockOpenAI.chat.completions.create.mockRejectedValue(new Error('OpenAI failure'));

    await expect(service.extractReceiptDetails('error.jpg')).rejects.toThrow('OpenAI failure');
  });

  it('should throw an error for unsupported file type', async () => {
    mockS3Service.getSignedUrl.mockImplementation(() => {
      throw new Error('Unsupported file type');
    });

    await expect(service.extractReceiptDetails('bad-file.exe')).rejects.toThrow('Unsupported file type');
  });
});