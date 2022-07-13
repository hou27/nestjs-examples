import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

export class FindUserOutput extends CoreOutput {
  user?: User;
}
