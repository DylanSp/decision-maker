import { EntityRepository, Repository } from "typeorm";
import { Choice } from "../entity/Choice";

@EntityRepository(Choice)
export class ChoiceRepository extends Repository<Choice> {
    
}