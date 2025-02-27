import { Logist } from 'src/logist/logist.entity';
import { Supplier } from 'src/supplier/supplier.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RequestProductInfo } from './RequestProductInfo.entity';

export enum RequestStatus {
  IN_PROCESS,
  REJECTED,
  CONFIRMED,
  COLLECTION,
  ON_THE_WAY,
  DELIVERED,
  COMPLETED,
}

export enum ProductType {
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
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Logist, (logist) => logist.requests, { eager: true })
  logist: Logist;

  @ManyToOne(() => Supplier, (supplier) => supplier.requests, { eager: true })
  supplier: Supplier;

  @OneToMany(() => RequestProductInfo, (productInfo) => productInfo.request, {
    eager: true,
  })
  productInfo: RequestProductInfo[];

  @Column({ type: 'timestamp' })
  dateOfDelivery: Date;

  @Column()
  addressOfDelivery: string;

  @Column({ type: 'enum', enum: ProductType })
  productType: ProductType;

  @Column({ default: '' })
  description: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.IN_PROCESS,
  })
  status: RequestStatus;
}
