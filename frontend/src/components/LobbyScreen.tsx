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
            <VoteList/>
            <VoteCreationButton />
            <Footer />
        </>
    );
}