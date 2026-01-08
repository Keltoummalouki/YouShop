
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_product')
  async handleCreateProduct(@Payload() data: any) {
    console.log('Creating product:', data.name);

    return this.appService.createProduct({
      name: data.name,
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock),
    });
  }

  @MessagePattern('get_products')
  async handleGetProducts() {
    return this.appService.getProducts();
  }
}