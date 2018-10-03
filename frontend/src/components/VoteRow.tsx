import { Button, Card, ListItem, Typography } from '@material-ui/core';
import { SFC } from 'react';
import * as React from 'react';
import { VoteSummary } from './VoteList';

const attemptToJoinVote = (hashid: string) => {
    // display VoteJoinPopup, with w/e router stuff is necessary
}

export const VoteRow: SFC<VoteSummary> = (props) => {
    return (
        <ListItem>
            <Card raised={true} style={{
                            margin: "0 auto", // center horizontally
                            padding: "0.5em",
                            width: "40%",
                            display: "flex"
            }}>
                <Typography style={{
                    display: "inline-block",
                    flex: "1 1 auto",   // pushes button to the right of card
                    alignSelf: "center"
                }}>
                    {props.name}
                </Typography>
                <Button variant="contained" onClick={() => attemptToJoinVote(props.hashid)}>
                    Join Vote
                </Button>
            </Card>
        </ListItem>
    );
}