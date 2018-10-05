import { Button } from '@material-ui/core';
import { SFC } from 'react';
import * as React from 'react';

interface VoteCreationButtonProps {
    onClick: () => void
}

export const VoteCreationButton: SFC<VoteCreationButtonProps> = (props) => {
    return (
        <div style={{textAlign: "center"}}>
            <Button variant="contained" size="large" color="primary" onClick={props.onClick}>
                Create Vote
            </Button>
        </div>
    );
}
