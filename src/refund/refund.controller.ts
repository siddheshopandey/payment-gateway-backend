import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { RefundService } from './refund.service';
import { CreateRefundDto } from './dto/create-refund.dto';

@Controller('refunds')
export class RefundController {

  constructor(
    private readonly refundService: RefundService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateRefundDto,
  ) {
    return this.refundService.create(dto);
  }

}
//C:\Users\Dell\payment-gateway\backend\src\