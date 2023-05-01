import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true }) // email should be unique.
  email: string;

  @Column({ select: false }) // password should not be selected.
  password: string;
}
