import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  Client = 'Client',
  Admin = 'Admin',
}

@Injectable()
@Entity()
export class User extends CoreEntity {
  @ApiProperty({ example: 'tester', description: 'User Name' })
  @Column()
  @IsString()
  name: string;

  @Column({ select: false })
  @IsString()
  password: string;

  @Column({ default: UserRole.Client })
  @ApiProperty({ description: 'User Role' })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.Client })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty()
  @Column({ nullable: true })
  @IsString()
  refresh_token?: string;

  @BeforeInsert() // Entity Listener
  @BeforeUpdate() // password need to hashed before save.
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(plainPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
