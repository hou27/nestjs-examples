import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('python')
  getHello(@Query() query): Promise<any> {
    return this.appService.getPyhton(query);
  }
}
