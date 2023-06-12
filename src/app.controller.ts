import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller('app')
export class AppController {
  /**
   * Is Alive request.
   */
  @ApiOperation({ summary: 'Checking if the service alive.' })
  @Get('is-alive')
  async getAllGames(): Promise<string> {
    return `Hello I am Alive!`;
  }
}
