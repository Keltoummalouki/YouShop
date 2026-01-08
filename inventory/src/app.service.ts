import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async addInventory(data: any) {
    return this.prisma.inventory.create({
      data: {
        sku: data.sku,
        productId: data.productId,
        quantity: data.quantity,
      },
    });
  }

  async getInventory() {
    return this.prisma.inventory.findMany();
  }

  // Deduct Stock Logic
  async reduceStock(data: any) {
    const { productId, quantity } = data;

    // Find the item
    const item = await this.prisma.inventory.findUnique({
      where: { productId: productId },
    });

    if (item) {
      // Update DB
      await this.prisma.inventory.update({
        where: { id: item.id },
        data: {
          quantity: item.quantity - quantity, // Deduct stock
          reserved: item.reserved + quantity, // Add to reserved (optional)
        },
      });
      console.log(`Stock updated for Product ${productId}. New Qty: ${item.quantity - quantity}`);
    } else {
      console.log(`Product ${productId} not found in Inventory!`);
    }
  }
}