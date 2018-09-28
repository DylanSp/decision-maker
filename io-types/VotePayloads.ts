// contains requests/responses for endpoints at and under /vote
// "request" and "response" are from the client's viewpoint; 
// request is client -> server, response is server -> client

import * as t from "io-ts";

export const VoteSummaryResponse = t.array(t.type({
    name: t.string,
    hashid: t.string
}));

/*
const payload = {
            name: "test vote",
            numVoters: 2,
            choices: [
                "Bush",
                "Gore",
                "Nader"
            ],
            password: "testPass"
        };
*/

export const VoteCreationRequest = t.type({
    name: t.string,
    numVoters: t.number,
    choices: t.array(t.string),
    password: t.string
});

export const VoteCreationResponse = t.intersection([
    t.type({
        hashid: t.string,
        isOpen: t.boolean
    }),
    VoteCreationRequest
]);

export const VoteDetailsResponse = t.intersection([
    t.partial({
        winner: t.string
    }),
    VoteCreationResponse
]);

export const BallotCreationRequest = t.array(t.string);