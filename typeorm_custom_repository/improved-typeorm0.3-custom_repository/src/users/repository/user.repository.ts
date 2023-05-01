import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async customMethod(id: number): Promise<User> {
    return await this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOneOrFail();
  }
}
