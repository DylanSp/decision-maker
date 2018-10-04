import { Button } from '@material-ui/core';
import { SFC } from 'react';
import * as React from 'react';

export const VoteCreationButton: SFC<{}> = () => {
    return (
        <div style={{textAlign: "center"}}>
            <Button variant="contained" size="large">
                Create Vote
            </Button>
        </div>
    );
}