import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_product')
  handleCreateProduct(@Payload() data: any) {
    return this.appService.createProduct(data);
  }

  // Mise à jour : Accepte les filtres
  @MessagePattern('get_products')
  handleGetProducts(@Payload() data: any) {
    return this.appService.getProducts(data || {});
  }

  // Get One
  @MessagePattern('get_product_by_id')
  handleGetProductById(@Payload() data: { id: number }) {
    return this.appService.getProductById(data.id);
  }

  @MessagePattern('update_product')
  handleUpdateProduct(@Payload() data: any) {
    return this.appService.updateProduct(data);
  }
}