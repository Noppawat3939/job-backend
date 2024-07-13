import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = 4000;

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
    .setTitle('Jobify APIs')
    .addServer('http://localhost:4000/', 'local')
    .setVersion('1.0')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  await app.listen(PORT, () => {
    console.log(`🟢 Started server port: ${PORT}`);
  });
}
bootstrap();
