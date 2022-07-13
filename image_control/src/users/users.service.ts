import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogoutOutput } from 'src/auth/dtos/login.dto';
import { Repository } from 'typeorm';
import {
  CreateAccountBodyDto,
  CreateAccountOutput,
} from '../auth/dtos/create-account.dto';
import { FindUserOutput } from './dtos/find-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async findById(id: number): Promise<FindUserOutput> {
    try {
      const user = await this.users.findOneBy({ id });
      if (!user) {
        throw new UnauthorizedException('User Not Found with that ID');
      }

      return { ok: true, user };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
