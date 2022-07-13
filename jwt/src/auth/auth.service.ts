import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountBodyDto,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginBodyDto, LoginOutput, LogoutOutput } from './dtos/login.dto';
import { RefreshTokenDto, RefreshTokenOutput } from './dtos/token.dto';
import { ValidateUserDto, ValidateUserOutput } from './dtos/validate-user.dto';
import { Payload } from './jwt/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async jwtLogin({ name, password }: LoginBodyDto): Promise<LoginOutput> {
    try {
      const { ok, user, error } = await this.validateUser({ name, password });
      if (ok) {
        const payload: Payload = { name, sub: user.id };
        const refreshToken = await this.jwtService.sign(payload, {
          secret: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
          expiresIn: '1d',
        });
        user.refresh_token = refreshToken;
        await this.users.save(user);

        return {
          ok: true,
          access_token: this.jwtService.sign(payload),
          refresh_token: refreshToken,
        };
      } else {
        return { ok: false, error };
      }
    } catch (error) {
      console.log(error);
      return { ok: false, error };
    }
  }

  async register({
    name,
    password,
  }: CreateAccountBodyDto): Promise<CreateAccountOutput> {
    try {
      const user = await this.users.findOneBy({ name: name });

      if (user) {
        throw new UnauthorizedException('Already exist');
      }

      const result = await this.users.save(
        this.users.create({ name, password }),
      );
      console.log(result);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async logout(userId: number): Promise<LogoutOutput> {
    try {
      const user = await this.users.findOneBy({ id: userId });
      if (user) {
        user.refresh_token = null;
        await this.users.save(user);

        return { ok: true };
      } else {
        return { ok: false, error: 'Error in logout process' };
      }
    } catch (error) {
      return { ok: false, error };
    }
  }

  async regenerateToken({
    refresh_token,
  }: RefreshTokenDto): Promise<RefreshTokenOutput> {
    try {
      // decoding refresh token
      const decoded = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
      });
      console.log(decoded);

      const user = await this.users.findOneBy({ id: decoded['sub'] });
      if (user && user.refresh_token === refresh_token) {
        const name = user.name,
          sub = user.id;
        const payload: Payload = { name, sub };
        const newRefreshToken = this.jwtService.sign(payload, {
          secret: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
          expiresIn: '1d',
        });

        await this.users.save([
          { id: user.id, refresh_token: newRefreshToken },
        ]);

        return {
          ok: true,
          access_token: this.jwtService.sign(payload),
          refresh_token: newRefreshToken,
        };
      } else {
        return { ok: false, error: 'User Not Found with that ID' };
      }
    } catch (error) {
      console.log(error);
      return { ok: false, error };
    }
  }

  async validateUser({
    name,
    password,
  }: ValidateUserDto): Promise<ValidateUserOutput> {
    try {
      const user = await this.users.findOne({
        where: { name },
        select: { id: true, name: true, password: true },
      });
      if (!user) {
        throw new UnauthorizedException('User Not Found');
      }

      const isPasswordCorrect = await user.checkPassword(password);
      delete user.password;

      if (isPasswordCorrect) {
        return { ok: true, user };
      } else {
        return { ok: false, error: 'Wrong Password' };
      }
    } catch (error) {
      return { ok: false, error };
    }
  }
}
