import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // Instead of a web app, we create a Microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'], // Connect to the same Post Office
        },
        consumer: {
          groupId: 'auth-consumer', // Unique ID for this worker
        },
      },
    },
  );

  await app.listen();
  console.log('Auth Microservice is listening to Kafka...');
}
bootstrap();
