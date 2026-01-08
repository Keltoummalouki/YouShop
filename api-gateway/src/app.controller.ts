import { 
  Controller, Post, Get, Body, Inject, OnModuleInit, UseGuards, Request 
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from './auth.guard';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientKafka,
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientKafka, 
    @Inject('INVENTORY_SERVICE') private readonly inventoryClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // Subscribe to all topics
    this.authClient.subscribeToResponseOf('create_user');
    this.authClient.subscribeToResponseOf('login_user');
    this.catalogClient.subscribeToResponseOf('create_product');
    this.catalogClient.subscribeToResponseOf('get_products');
    this.ordersClient.subscribeToResponseOf('create_order'); 
    this.ordersClient.subscribeToResponseOf('get_orders');   
    this.inventoryClient.subscribeToResponseOf('create_inventory');
    this.inventoryClient.subscribeToResponseOf('get_inventory');

    await this.authClient.connect();
    await this.catalogClient.connect();
    await this.ordersClient.connect();
    await this.inventoryClient.connect();

    await this.authClient.connect();
    await this.catalogClient.connect();
    await this.ordersClient.connect();
  }

  @Post('register')
  createUser(@Body() body: any) {
    return this.authClient.send('create_user', body);
  }

  @Post('login')
  loginUser(@Body() body: any) {
    return this.authClient.send('login_user', body);
  }

  @UseGuards(AuthGuard)
  @Post('products')
  createProduct(@Body() body: any) {
    return this.catalogClient.send('create_product', body);
  }

  @Get('products')
  getProducts() {
    return this.catalogClient.send('get_products', {});
  }

  @UseGuards(AuthGuard)
  @Post('orders')
  createOrder(@Body() body: any, @Request() req: any) {
    // take the User ID from the JWT Token (req.user)
    const userId = req.user.sub; 
    
    return this.ordersClient.send('create_order', {
      userId: userId,       
      productId: body.productId,
      quantity: body.quantity,
      total: body.total
    });
  }

  @UseGuards(AuthGuard)
  @Get('orders')
  getOrders() {
    return this.ordersClient.send('get_orders', {});
  }

  @UseGuards(AuthGuard)
  @Post('inventory')
  addInventory(@Body() body: any) {
    return this.inventoryClient.send('create_inventory', body);
  }

  @Get('inventory')
  getInventory() {
    return this.inventoryClient.send('get_inventory', {});
  }
}