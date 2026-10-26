import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class AppService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      throw new Error('La clé API Stripe (STRIPE_SECRET_KEY) est manquante dans le .env !');
    }

    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }

  async createCheckoutSession(data: { orderId: number; amount: number; productName: string }) {
    const frontendUrl = 'http://localhost:3000'; 

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: data.productName,
            },
            unit_amount: Math.round(data.amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}/success`, 
      cancel_url: `${frontendUrl}/cancel`,
    });

    await this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        stripeSessionId: session.id,
        amount: data.amount,
        status: 'PENDING',
      },
    });

    return { url: session.url };
  }
}