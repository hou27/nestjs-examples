import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from './auth-user.decorator';
import { AuthService } from './auth.service';
import {
  CreateAccountBodyDto,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { DeleteAccountOutput } from './dtos/delete-account.dto';
import { LoginBodyDto, LoginOutput, LogoutOutput } from './dtos/login.dto';
import { RefreshTokenDto, RefreshTokenOutput } from './dtos/token.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입', description: '회원가입 메서드입니다.' })
  @ApiCreatedResponse({
    description: '회원가입 성공 여부를 알려줍니다.',
    type: CreateAccountOutput,
  })
  @Post('register')
  async register(
    @Body() createAccountBody: CreateAccountBodyDto,
  ): Promise<CreateAccountOutput> {
    console.log(createAccountBody);
    return await this.authService.register(createAccountBody);
  }

  @ApiOperation({ summary: '로그인', description: '로그인 메서드입니다.' })
  @ApiCreatedResponse({
    description: '로그인 성공 여부와 함께 access, refresh token을 반환합니다.',
    type: LoginOutput,
  })
  @Post('login')
  async login(@Body() loginBody: LoginBodyDto): Promise<LoginOutput> {
    return await this.authService.jwtLogin(loginBody);
  }

  @ApiOperation({ summary: '로그아웃', description: '로그아웃 메서드입니다.' })
  @ApiCreatedResponse({
    description: '로그아웃 성공 여부를 알려줍니다.',
    type: LogoutOutput,
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@AuthUser() user: User): Promise<LogoutOutput> {
    return await this.authService.logout(user.id);
  }

  @ApiOperation({ summary: '회원탈퇴', description: '회원탈퇴 메서드입니다.' })
  @ApiCreatedResponse({
    description: '회원탈퇴 성공 여부를 알려줍니다.',
    type: DeleteAccountOutput,
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteAccount(@AuthUser() user: User): Promise<DeleteAccountOutput> {
    return await this.authService.deleteAccount(user.id);
  }

  @ApiOperation({
    summary: '토큰 재발행',
    description: 'access, refresh 토큰을 재발행하는 메서드입니다.',
  })
  @ApiCreatedResponse({
    description: '재발행된 토큰들을 반환합니다.',
    type: RefreshTokenOutput,
  })
  @Post('reissue')
  async regenerateToken(
    @Body() regenerateBody: RefreshTokenDto,
  ): Promise<RefreshTokenOutput> {
    return await this.authService.regenerateToken(regenerateBody);
  }

  // verify email
  @ApiOperation({
    summary: '이메일 인증',
    description: '이메일 인증 메서드입니다.',
  })
  @ApiCreatedResponse({
    description: '이메일 인증 성공 여부를 알려줍니다.',
    type: LoginOutput,
  })
  @Get('verify-email')
  async verifyEmail(@Query('code') code: string): Promise<VerifyEmailOutput> {
    return await this.authService.verifyEmail(code);
  }
}
