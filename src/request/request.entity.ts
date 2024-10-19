import { Logist } from 'src/logist/logist.entity';
import { Supplier } from 'src/supplier/supplier.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Request {
    @PrimaryGeneratedColumn()
    requestId: string;

    @Column()
    logist: Logist;

    @Column()
    supplier: Supplier;

    @Column()
    productId: string;

    @Column()
    dateOfDelivery: Date;

    @Column()
    addressOfDelivery: string;

    @Column()
    productType: string;

    @Column()
    description: string;

}
