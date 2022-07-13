import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from './entities/user.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(/*private readonly usersService: UserService*/) {}

  @ApiOperation({
    summary: '자신의 정보 조회',
    description: '자신의 정보를 조회하는 메서드입니다.',
  })
  @ApiCreatedResponse({
    description: '현재 유저의 정보를 반환합니다.',
    type: User,
  })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('me')
  getMyInfo(@AuthUser() user: User): User {
    return user;
  }
}
