import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_inventory')
  handleCreateInventory(@Payload() data: any) {
    return this.appService.addInventory(data);
  }

  @MessagePattern('get_inventory')
  handleGetInventory() {
    return this.appService.getInventory();
  }

  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any) {
    console.log('⚡ Event Received: order_created', data);
    return this.appService.reduceStock(data);
  }
}