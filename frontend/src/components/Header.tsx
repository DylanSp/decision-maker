import Typography from '@material-ui/core/Typography'
import { SFC } from 'react';
import * as React from 'react';

export const Header: SFC<{}> = () => {
    return (
        <>
            <Typography align="center" variant="display4" gutterBottom={true} color="textPrimary">
                Decision Maker
            </Typography>
            <Typography align="center" variant="display1" gutterBottom={true}>
                A web app for making quick, fair decisions using <a href="https://en.wikipedia.org/wiki/Instant-runoff_voting">instant-runoff voting</a>. 
            </Typography>
        </>
    );
}