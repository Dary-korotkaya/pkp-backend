import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Request } from '../request/request.entity';
import { Users } from '../user/user.entity';

@Entity()
export class Logist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Users, (user) => user.logist)
  user: Users;

  @OneToMany(() => Request, (request) => request.logist)
  requests: Request[];
}
