import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class App extends CoreEntity {
  @Column()
  text: string;
}
