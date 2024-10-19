import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import {Request} from './../request/request.entity';

@Entity()
export class Supplier {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    companyName: string;

    @Column()
    companyAddress: string;

    @Column()
    productType: string;

    @OneToMany(() => Request, request => request.supplier)
    requests: Request[];

    // Может быть другие отношения
}