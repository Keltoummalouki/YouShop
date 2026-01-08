import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'de72153c7ae4e991f786959eb3f28e65ef057d1f09f6bccc3d2d83ef00b63611',
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: { clientId: 'api-gateway-auth', brokers: ['localhost:9092'] },
          consumer: { groupId: 'auth-consumer' },
        },
      },
      {
        name: 'CATALOG_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: { clientId: 'api-gateway-catalog', brokers: ['localhost:9092'] },
          consumer: { groupId: 'catalog-consumer' },
        },
      },
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: { clientId: 'api-gateway-orders', brokers: ['localhost:9092'] },
          consumer: { groupId: 'orders-consumer' },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}