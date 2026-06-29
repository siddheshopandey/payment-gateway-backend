import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
  ) {}

  // Create Payment
  async create(
    createPaymentDto: CreatePaymentDto,
    merchantId: string,
  ) {
    // Prevent duplicate payment requests
    const existing = await this.prisma.payment.findFirst({
      where: {
        merchantId,
        customerEmail: createPaymentDto.customerEmail,
        amount: createPaymentDto.amount,
        status: 'SUCCESS',
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Duplicate payment request',
      );
    }

    const payment = await this.prisma.payment.create({
      data: {
        amount: createPaymentDto.amount,
        customerName: createPaymentDto.customerName,
        customerEmail: createPaymentDto.customerEmail,
        merchantId,
        status: "SUCCESS",
      },
    });

    await this.notification.sendPaymentNotification(
      payment.id,
      createPaymentDto.customerEmail,
);

    return payment;
  }

  // Get all payments
  async findAll(merchantId: string) {
    return this.prisma.payment.findMany({
      where: {
        merchantId,
      },
      include: {
        merchant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        refunds: true,
        notifications: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get one payment
  async findOne(
    id: string,
    merchantId: string,
  ) {
    const payment =
      await this.prisma.payment.findFirst({
        where: {
          id,
          merchantId,
        },
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          refunds: true,
          notifications: true,
        },
      });

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      );
    }

    return payment;
  }

  // Update payment status
  async updateStatus(id: string) {
    return this.prisma.payment.update({
      where: {
        id,
      },
      data: {
        status: 'SUCCESS',
      },
    });
  }
}