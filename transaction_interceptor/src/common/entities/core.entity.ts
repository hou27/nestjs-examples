import { PrimaryGeneratedColumn } from 'typeorm';

export class CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
