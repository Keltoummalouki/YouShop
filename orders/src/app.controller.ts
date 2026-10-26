import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_order')
  handleCreateOrder(@Payload() data: any) {
    console.log('Creating order for user:', data.userId);
    return this.appService.createOrder(data);
  }

@MessagePattern('get_orders')
  handleGetOrders(@Payload() data: any) {
    // Si un userId est fourni, on filtre. Sinon (Admin), on renvoie tout.
    return this.appService.getOrders(data.userId);
  }
}