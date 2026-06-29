import {
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateRefundDto {

  @IsString()
  paymentId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  reason?: string;
}