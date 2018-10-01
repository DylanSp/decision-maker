import { Request, Response } from "express";
import { Left } from "fp-ts/lib/Either";
import Hashids from "hashids";
import { PathReporter } from "io-ts/lib/PathReporter";

import { VoteCreationRequest } from "common";

import { Choice } from "../entity/Choice";
import { Vote } from "../entity/Vote";
import { ChoiceRepository } from "../repository/ChoiceRepository";
import { VoteRepository } from "../repository/VoteRepository";



// hashids are all alphabetic, no digits, for testing/readability
const hashidMinLength = 5;
const idAlphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class VoteController {

    private readonly voteRepo: VoteRepository;
    private readonly choiceRepo: ChoiceRepository;
    private readonly hashids: Hashids;

    public constructor(voteRepo: VoteRepository, choiceRepo: ChoiceRepository, hashidSalt: string) {
        this.voteRepo = voteRepo;
        this.choiceRepo = choiceRepo;
        this.hashids = new Hashids(hashidSalt, hashidMinLength, idAlphabet);
    }
    
    public summarizeAllVotes = async (req: Request, res: Response): Promise<void> => {
        const votes = await this.voteRepo.find({
            select: ["name", "id"],
            where: {
                isOpen: true
            }
        });

        res.json(votes.map(vote => ({
            name: vote.name,
            hashid: this.hashids.encode(vote.id)
        })));
    }

    public createVote = async (req: Request, res: Response): Promise<void> => {
        const request = VoteCreationRequest.decode(req.body);
        if (request.isLeft()) {
            res.status(400)
            .send(PathReporter.report(request).toString());
            return;
        }
        const requestPayload = request.value;

        const newVote = new Vote();
        newVote.name = requestPayload.name
        newVote.numVoters = requestPayload.numVoters;
        newVote.password = requestPayload.password;
        newVote.isOpen = true;
        newVote.choices = req.body.choices.map(choiceName => new Choice(choiceName));

        // take out id, choices properties;
        // see https://codeburst.io/use-es2015-object-rest-operator-to-omit-properties-38a3ecffe90
        const {id, choices, ...voteWithoutId } = await this.voteRepo.save(newVote);
       
        const returnPayload = {
            hashid: this.hashids.encode(id),
            choices: choices.map(choice => choice.name),
            ...voteWithoutId
        };

        res.status(201)
        .set("Location", "/votes/" + returnPayload.hashid)
        .json(returnPayload);
    }
    
    public getVoteDetails = async (req: Request, res: Response): Promise<void> => {
        const hashid = req.params.voteid;

        // TODO - from manual testing, appears to find votes even when a nonexistent ID is given; investigate
        const vote = await this.voteRepo.findOne(this.hashids.decode(hashid)[0], {relations: ["choices"]});
        
        if(!vote) { // undefined vote => no vote exists with this id
            res.status(404)
            .send();
            return;
        }

        const { id, choices, ...voteWithoutId } = vote;
        const winningChoice: Choice | undefined = choices.find(choice => choice.isWinner);
        const returnPayload = {
            hashid: this.hashids.encode(id),
            choices: choices.map(choice => choice.name),
            winner: winningChoice ? winningChoice.name : undefined, 
            ...voteWithoutId
        };
        res.json(returnPayload);
    }
    
    // does not return contents of the ballot; 
    // the ballot isn't visible or requestable after being submitted
    public processBallot = async (req: Request, res: Response): Promise<void> => {
        res.status(204)
        .send();
    }
}
