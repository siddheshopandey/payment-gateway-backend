import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async sendPaymentNotification(
    paymentId: string,
    email: string,
  ) {
    console.log(`📧 Payment notification sent to ${email}`);

    await this.prisma.notification.create({
      data: {
        paymentId,
        status: 'PAYMENT_SUCCESS',
        success: true,
        attempts: 1,
      },
    });
  }

  async sendRefundNotification(
    paymentId: string,
    email: string,
  ) {
    console.log(`📧 Refund notification sent to ${email}`);

    await this.prisma.notification.create({
      data: {
        paymentId,
        status: 'REFUND_CREATED',
        success: true,
        attempts: 1,
      },
    });
  }
}