import * as React from 'react';

interface VoteSummary {
    name: string,
    hashid: string
}

export interface VoteListState {
    // list of votes, fetched in componentDidMount()
    voteList: VoteSummary[]
}

export class VoteList extends React.Component<{}, VoteListState> {

    public render() {
        return (
            <>
                <h2>
                    Votes in Progress
                </h2>
            </>
        );
    }
}