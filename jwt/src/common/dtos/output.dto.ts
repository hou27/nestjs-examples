import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CoreOutput {
  @ApiProperty()
  @IsBoolean()
  ok: boolean;

  @ApiProperty()
  error?: string;
}
