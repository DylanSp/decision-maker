import { SFC } from 'react';
import * as React from 'react';

export const Header: SFC<{}> = () => {
    return (
        <>
            <h1>
                Decision Maker
            </h1>
            <h3>
                A web app for making quick, fair decisions using <a href="https://en.wikipedia.org/wiki/Instant-runoff_voting">instant-runoff voting</a>. 
            </h3>
        </>
    );
}