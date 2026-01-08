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
  handleGetOrders() {
    return this.appService.getOrders();
  }
}