import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { App } from './entities/app.entity';
import { Owner } from './entities/owner.entity';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  async transactionTest(): Promise<void> {
    const queryRunner = await this.init();
    const queryRunnerManager: EntityManager = await queryRunner.manager;

    try {
      const appInDb = await queryRunnerManager.findOne(App, {
        where: { id: 1 },
        relations: {
          owner: true,
        },
      });

      // update app
      if (appInDb) {
        appInDb.title = 'updated';
        queryRunnerManager.save(appInDb);
      }

      appInDb.owner.name = 'newOwner';

      queryRunnerManager.save(Owner, [
        { id: appInDb.owner.id, name: appInDb.owner.name },
      ]);

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    }
  }

  //initalize the database
  async init(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }
}
