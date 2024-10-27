import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';
import { Request } from '../request/request.entity';
import { RequestProductInfo } from '../request/RequestProductInfo.entity';

enum ProductType {
  FRUITS_AND_VEGETABLES = 'Fruits and vegetables',
  DAIRY_PRODUCTS = 'Dairy products',
  MEAT = 'Meat and poultry',
  FISH = 'Fish and seafood',
  BAKERY_PRODUCTS = 'Bakery products',
  CANNED_FOOD = 'Canned food',
  FROZEN_FOOD = 'Frozen food',
  SWEETS = 'Sweets and snacks',
  BEVERAGES = 'Beverages',
  SPICES = 'Spices and seasonings',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  totalQuantity: number;

  @Column({ default: 0, type: 'float' })
  price: number;

  @Column({ default: true })
  inStock: boolean;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  supplier: Supplier;

  @OneToMany(
    () => RequestProductInfo,
    (requestProductInfo) => requestProductInfo.request,
  )
  requestProductInfos: RequestProductInfo[];
}
