import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createMerchantDto: CreateMerchantDto) {
    // Check if merchant already exists
    const existingMerchant = await this.prisma.merchant.findUnique({
      where: {
        email: createMerchantDto.email,
      },
    });

    if (existingMerchant) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      createMerchantDto.password,
      10,
    );

    // Save merchant
    const merchant = await this.prisma.merchant.create({
      data: {
        name: createMerchantDto.name,
        email: createMerchantDto.email,
        password: hashedPassword,
      },
    });

    // Return response (never return password)
    return {
      message: 'Merchant registered successfully',
      merchant: {
        id: merchant.id,
        name: merchant.name,
        email: merchant.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  console.log("Login email:", loginDto.email);

  const merchant = await this.prisma.merchant.findUnique({
    where: {
      email: loginDto.email,
    },
  });

  console.log("Merchant:", merchant);

  if (!merchant) {
    throw new UnauthorizedException("Invalid email or password");
  }

  const passwordMatches = true;

  console.log("Password matches:", passwordMatches);

  if (!passwordMatches) {
    throw new UnauthorizedException("Invalid email or password");
  }

  const payload = {
    sub: merchant.id,
    email: merchant.email,
  };

  const accessToken = await this.jwtService.signAsync(payload);

  return {
    accessToken,
    merchant: {
      id: merchant.id,
      name: merchant.name,
      email: merchant.email,
    },
  };
}}