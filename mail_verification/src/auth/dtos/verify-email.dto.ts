import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Verification } from 'src/users/entities/verification.entity';

export class VerifyEmailOutput extends CoreOutput {}

// export class VerifyEmailInput extends PickType(Verification, ['code']) {}
