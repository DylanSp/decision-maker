// contains requests/responses for endpoints at and under /vote
// "request" and "response" are from the client's viewpoint; 
// request is client -> server, response is server -> client

import * as t from "io-ts";

export const VoteSummaryResponse = t.array(t.type({
    name: t.string,
    hashid: t.string
}));
