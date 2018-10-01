import { SFC } from 'react';
import * as React from 'react';
import { VoteSummary } from './VoteList';

const attemptToJoinVote = (hashid: string) => {
    // display VoteJoinPopup, with w/e router stuff is necessary
}

export const VoteRow: SFC<VoteSummary> = (props) => {
    return (
        <div onClick={() => attemptToJoinVote(props.hashid)}>
            {props.name}
        </div>
    );
}