import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaService } from './prisma.service.js';
import { Prisma } from './generated/prisma/client.js';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('INVENTORY_SERVICE') private readonly inventoryClient: ClientKafka, 
  ) {}

  async createOrder(data: any) {
    // 1. Save the Order to DB
    const newOrder = await this.prisma.order.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        quantity: data.quantity,
        total: data.total,
        status: 'CONFIRMED',
      },
    });

    // 2. Emit the Event (Fire and Forget)
    // send the order details so Inventory knows what to deduct
    this.inventoryClient.emit('order_created', {
      orderId: newOrder.id,
      productId: newOrder.productId,
      quantity: newOrder.quantity,
    });
    console.log(`Event emitted: order_created for Order #${newOrder.id}`);

    return newOrder;
  }

  async getOrders() {
    return this.prisma.order.findMany();
  }
}