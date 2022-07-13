import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../../users/entities/user.entity';

export class LoginBodyDto extends PickType(User, ['name', 'password']) {}

export class LoginOutput extends CoreOutput {
  @ApiProperty()
  access_token?: string;

  @ApiProperty()
  refresh_token?: string;
}

export class LogoutOutput extends CoreOutput {}
