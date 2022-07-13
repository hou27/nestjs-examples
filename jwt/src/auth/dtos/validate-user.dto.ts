import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from 'src/users/entities/user.entity';

export class ValidateUserDto extends PickType(User, ['name', 'password']) {}

export class ValidateUserOutput extends CoreOutput {
  @ApiProperty()
  user?: User;
}
