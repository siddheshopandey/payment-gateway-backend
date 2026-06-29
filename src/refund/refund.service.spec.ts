import { Test, TestingModule } from '@nestjs/testing';
import { RefundService } from './refund.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RefundService', () => {
  let service: RefundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefundService,
        {
          provide: PrismaService,
          useValue: {
            payment: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            refund: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RefundService>(RefundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});