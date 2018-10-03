import { Divider } from '@material-ui/core';
import { SFC } from 'react';
import * as React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { VoteCreationButton } from './VoteCreationButton';
import { VoteList } from './VoteList';

export const LobbyScreen: SFC<{}> = () => {
    return (
        <>
            <Header />
            <Divider style={{
                marginTop: "3em",
                marginBottom: "3em",
                marginLeft: 72,
                marginRight: 72,
            }}  />
            <VoteList/>
            <VoteCreationButton />
            <Footer />
        </>
    );
}