import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vote } from "./Vote";

@Entity()
export class Choice {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    // null indicates winner for this choice's vote hasn't been calculated
    @Column({nullable: true})
    public isWinner: boolean;

    @ManyToOne(type => Vote, vote => vote.id)
    public vote: Vote;
    
    public constructor(name: string) {
        this.name = name;
    }
}