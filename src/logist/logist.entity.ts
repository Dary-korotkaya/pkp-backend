import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import {Request} from './../request/request.entity';

@Entity()
export class Logist {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Request, request => request.logist)
    requests: Request[];

    // Может быть другие отношения
}
