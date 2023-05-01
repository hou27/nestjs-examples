import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async originalMethod(body: { name: string; email: string }): Promise<User> {
    return this.userRepository.save(body);
  }

  async customMethod(id: number): Promise<User> {
    return this.userRepository.customMethod(id);
  }
}
