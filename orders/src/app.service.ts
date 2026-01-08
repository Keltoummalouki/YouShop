import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { Prisma } from './generated/prisma/client.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(data: any) {
    return this.prisma.order.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        quantity: data.quantity,
        total: data.total, 
        status: 'CONFIRMED',
      },
    });
  }

  async getOrders() {
    return this.prisma.order.findMany();
  }
}