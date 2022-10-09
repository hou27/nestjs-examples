import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: UserRepository,
  ) {}

  async getMyInfo(userId: number): Promise<User> {
    try {
      const user = await this.users.getUserWithPassword(userId);

      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
