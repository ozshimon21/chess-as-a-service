import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SquareCoordinatePairDto } from './chess/dtos/square-coordinate-pair.dto';
import { GameDto } from './chess/dtos/game.dto';
import { ChessMoveDto } from './chess/dtos/chess-move.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Chess as as service')
    .setDescription('The chess as a service description')
    .setVersion('1.0')
    .addTag('chess')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [SquareCoordinatePairDto, GameDto, ChessMoveDto],
  });
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
