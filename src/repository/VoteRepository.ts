import { EntityRepository, Repository } from "typeorm";
import { Vote } from "../entity/Vote";

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {
    
}