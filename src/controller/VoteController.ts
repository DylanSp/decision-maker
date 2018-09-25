import { Request, Response } from "express";
import { VoteRepository } from "../repository/VoteRepository";

export class VoteController {

    public readonly repo: VoteRepository;

    public constructor(repo: VoteRepository) {
        this.repo = repo;
    }
    
    public summarizeAllVotes = async (req: Request, res: Response): Promise<void> => {
        const votes = await this.repo.find({
            select: ["name"],
            where: {
                isOpen: true
            }
        });
        res.json(votes);
    }

    public async createVote(req: Request, res: Response): Promise<void> {

    }
    
    public async getVoteDetails(req: Request, res: Response): Promise<void> {
    
    }
    
    public async processBallot(req: Request, res: Response): Promise<void> {
    
    }
}
