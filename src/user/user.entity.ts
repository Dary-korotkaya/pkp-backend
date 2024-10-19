import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    logistId: string;

    @Column()
    supplierId: string;

    @Column()
    fullName: string;

    @Column()
    dateOfBirth: Date;

    @Column()
    phoneNumber: string;

    @Column()
    email: string;

    @Column()
    login: string;

    @Column()
    password: string;

    @Column()
    additionalINFO: string;

}