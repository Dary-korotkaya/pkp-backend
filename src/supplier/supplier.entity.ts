import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Request } from '../request/request.entity';
import { User } from '../user/user.entity';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.supplier)
  user: User;

  @Column()
  companyName: string;

  @Column()
  companyAddress: string;

  @Column()
  productType: string;

  @OneToMany(() => Request, (request) => request.supplier)
  requests: Request[];

  // Может быть другие отношения
}
