import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('original')
  async originalMethod(
    @Body() body: { name: string; email: string },
  ): Promise<User> {
    return this.usersService.originalMethod(body);
  }

  @Get('custom/:id')
  async customMethod(@Param('id') id: number): Promise<User> {
    return this.usersService.customMethod(id);
  }
}
