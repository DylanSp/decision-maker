import { Request, Response } from "express";

export async function summarizeAllVotes(req: Request, res: Response): Promise<void> {
    res.send("Hi!");
}

export async function createVote(req: Request, res: Response): Promise<void> {

}

export async function getVoteDetails(req: Request, res: Response): Promise<void> {

}

export async function processBallot(req: Request, res: Response): Promise<void> {

}