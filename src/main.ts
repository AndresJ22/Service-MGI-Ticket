import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('MGI Tickets API')
    .setDescription('Sistema de venta de entradas con alta concurrencia')
    .setVersion('1.0')
    .addTag('reservations', 'Gestión de reservas de entradas')
    .addTag('payments', 'Confirmación de pagos')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
  console.log(`Application is running on: http://localhost:3001`);
  console.log(`Swagger documentation: http://localhost:3001/api`);
}
bootstrap();
