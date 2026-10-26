import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service.js';
import { Prisma } from '@prisma/client';

class LoginDto {
  email!: string;
  password!: string;
}

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_user')
  handleUserCreate(@Payload() data: Prisma.UserCreateInput) {
    return this.appService.createUser(data);
  }

  @MessagePattern('login_user')
  async handleUserLogin(@Payload() data: LoginDto) {
    this.logger.log(`Login attempt for: ${data.email}`);
    const user = await this.appService.validateUser(data);
    if (!user) {
      return { error: 'Invalid Credentials' };
    }
    return this.appService.login(user);
  }
}
