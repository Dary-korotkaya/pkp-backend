import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Request } from './../request/request.entity';
import { User } from '../user/user.entity';

@Entity()
export class Logist {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.logist)
  user: User;

  @OneToMany(() => Request, (request) => request.logist)
  requests: Request[];

}
