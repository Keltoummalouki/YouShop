import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_payment_session')
  handleCreatePaymentSession(@Payload() data: any) {
    console.log('Generating Stripe Link for Order:', data.orderId);
    return this.appService.createCheckoutSession(data);
  }
}