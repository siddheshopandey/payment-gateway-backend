import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class RefundService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
  ) {}

  async create(dto: CreateRefundDto) {
    const payment = await this.prisma.payment.findUnique({
      where: {
        id: dto.paymentId,
      },
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    if (payment.status !== 'SUCCESS') {
      throw new BadRequestException(
        'Only successful payments can be refunded',
      );
    }

    const previousRefunds =
      await this.prisma.refund.findMany({
        where: {
          paymentId: dto.paymentId,
        },
      });

    const refundedAmount =
      previousRefunds.reduce(
        (sum, refund) => sum + Number(refund.amount),
        0,
      );

    if (
      refundedAmount + Number(dto.amount) >
      Number(payment.amount)
    ) {
      throw new BadRequestException(
        'Refund exceeds remaining amount',
      );
    }

    const refund = await this.prisma.refund.create({
      data: {
        amount: dto.amount,
        reason: dto.reason,
        paymentId: dto.paymentId,
      },
    });

    const totalRefunded =
      refundedAmount + Number(dto.amount);

    await this.prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status:
          totalRefunded === Number(payment.amount)
            ? 'REFUNDED'
            : 'PARTIALLY_REFUNDED',
      },
    });

    await this.notification.sendRefundNotification(
      payment.id,
      payment.customerEmail,
);

    return refund;
  }
}