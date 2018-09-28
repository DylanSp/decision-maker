import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Choice } from "./Choice";

@Entity()
export class Vote {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public numVoters: number;

    @Column()
    public password: string;

    @Column()
    public isOpen: boolean;

    @OneToMany(type => Choice, choice => choice.vote, {cascade: true})
    public choices: Choice[];
}