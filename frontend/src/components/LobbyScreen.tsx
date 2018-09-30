import { SFC } from 'react';
import * as React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { VoteCreationButton } from './VoteCreationButton';
import { VoteSummaryPoller } from './VoteSummaryPoller';

export const LobbyScreen: SFC<{}> = () => {
    return (
        <>
            <Header />
            <VoteSummaryPoller />
            <VoteCreationButton />
            <Footer />
        </>
    );
}