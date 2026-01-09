import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { Prisma } from './generated/prisma/client.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  async getProducts(params: { 
    page?: number; 
    limit?: number; 
    category?: string; 
    minPrice?: number; 
    maxPrice?: number; 
  }) {
    const { page = 1, limit = 10, category, minPrice, maxPrice } = params;
    const skip = (page - 1) * limit;

    // Construction dynamique du filtre
    const where: Prisma.ProductWhereInput = {};
    
    if (category) {
      where.category = { contains: category, mode: 'insensitive' }; // Insensible à la casse
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice.toString());
      if (maxPrice) where.price.lte = parseFloat(maxPrice.toString());
    }

    // Récupération des données + Compte total (pour la pagination frontend)
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }, // Les plus récents en premier
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page: Number(page),
        lastPage: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getProductById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async updateProduct(data: { id: number; price?: number; name?: string; description?: string }) {
    const { id, ...updates } = data;
    return this.prisma.product.update({
      where: { id },
      data: updates,
    });
  }
}