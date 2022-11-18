import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class AppService {
  getHello(queryRunnerManager: EntityManager): string {
    // queryRunnerManager is undefined when running the test
    // queryRunnerManager is defined when running the app
    console.log(queryRunnerManager);

    return 'Hello World!';
  }
}
