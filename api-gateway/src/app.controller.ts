import { Controller, Post, Get, Body, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientKafka, 
  ) {}

  async onModuleInit() {
    // Auth Topics
    this.authClient.subscribeToResponseOf('create_user');
    this.authClient.subscribeToResponseOf('login_user');
    await this.authClient.connect();

    // Catalog Topics
    this.catalogClient.subscribeToResponseOf('create_product'); // Subscribe to Topics
    this.catalogClient.subscribeToResponseOf('get_products');
    await this.catalogClient.connect();
  }

  // --- AUTH ROUTES ---
  @Post('register')
  createUser(@Body() body: any) {
    return this.authClient.send('create_user', body);
  }

  @Post('login')
  loginUser(@Body() body: any) {
    return this.authClient.send('login_user', body);
  }

  // --- CATALOG ROUTES (NEW) ---
  @Post('products')
  createProduct(@Body() body: any) {
    console.log('Gateway: Creating product...');
    return this.catalogClient.send('create_product', body);
  }

  @Get('products')
  getProducts() {
    console.log('Gateway: Getting products...');
    return this.catalogClient.send('get_products', {});
  }
}