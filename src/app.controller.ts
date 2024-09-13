import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('public')
  getPublicMessage(): { message: string } {
    return this.appService.getPublicMessage();
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  getProtectedMessage(): { message: string } {
    return this.appService.getProtectedMessage();
  }
}
