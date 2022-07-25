import { Injectable } from '@nestjs/common';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Owner } from './owner.entity';

@Injectable()
@Entity()
export class App {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToOne((type) => Owner, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: Owner;
}
