import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Request } from './request.entity';

@Entity()
export class RequestProductInfo {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Request, (request) => request.productInfo)
  request: Request;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;
}
