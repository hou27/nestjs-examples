import { Controller, Get, Param } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('myInfo/:userId')
  async getMyInfo(@Param('userId') userId: string): Promise<User> {
    return this.usersService.getMyInfo(+userId);
  }
}
