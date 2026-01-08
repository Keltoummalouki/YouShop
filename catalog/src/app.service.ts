import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { Prisma } from './generated/prisma/client.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
    });
  }

  async getProducts() {
    return this.prisma.product.findMany();
  }
}