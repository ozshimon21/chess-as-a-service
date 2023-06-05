import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GameDto } from './chess/dtos/game.dto';
import { ChessMoveDto } from './chess/dtos/chess-move.dto';
import { GameHistoryDto } from './chess/dtos/game-history.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Chess as as service')
    .setDescription('Chess Game Nest.js Backend API')
    .setVersion('1.0')
    .addTag('chess')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [GameDto, ChessMoveDto, GameHistoryDto],
  });
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
