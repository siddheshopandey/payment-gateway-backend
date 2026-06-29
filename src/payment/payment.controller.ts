import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Param, Patch } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(
    @Req() req,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.create(
      createPaymentDto,
      req.user.merchantId,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.paymentService.findAll(req.user.merchantId);
  }
  @Get(':id')
  findOne(
    @Req() req,
    @Param('id') id: string,
) {
    return this.paymentService.findOne(
        id,
        req.user.merchantId,
    );
}

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    ) {
    return this.paymentService.updateStatus(id);
}
}