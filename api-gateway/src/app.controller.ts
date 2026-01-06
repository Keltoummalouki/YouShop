import {
  Controller,
  Post,
  Body,
  Inject,
  OnModuleInit,
  Get,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // 1. Subscribe to the topics we need
    this.authClient.subscribeToResponseOf('create_user');
    this.authClient.subscribeToResponseOf('login_user'); // <--- NEW: Listen for login replies
    await this.authClient.connect();
  }

  @Post('register')
  createUser(@Body() body: any) {
    return this.authClient.send('create_user', body);
  }

  // 2. Add the Login Route
  @Post('login')
  loginUser(@Body() body: any) {
    return this.authClient.send('login_user', body);
  }

  @Get()
  getHello() {
    return 'API Gateway is running!';
  }
}
