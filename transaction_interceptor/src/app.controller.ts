import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AppService } from './app.service';
import { TransactionInterceptor } from './common/interceptors/transaction.interceptor';
import { TransactionManager } from './common/transaction.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(TransactionInterceptor)
  getHello(@TransactionManager() queryRunnerManager: EntityManager): string {
    return this.appService.getHello(queryRunnerManager);
  }
}
