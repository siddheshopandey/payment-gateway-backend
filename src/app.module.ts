import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PaymentModule } from './payment/payment.module';
import { RefundModule } from './refund/refund.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [PrismaModule, AuthModule,  PaymentModule, RefundModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
