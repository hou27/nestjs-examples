import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne, BeforeInsert } from 'typeorm';
import { User } from './user.entity';
// import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Verification extends CoreEntity {
  // one to one relationship
  @ApiProperty({ description: 'Authentication code' })
  @Column()
  code: string;

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = Math.random().toString(36).substring(2); //uuidv4();
  }
}
