import { Divider } from '@material-ui/core';
import * as React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { VoteCreationButton } from './VoteCreationButton';
import { VoteCreationModal } from './VoteCreationModal';
import { VoteList } from './VoteList';

interface LobbyScreenState {
    isVoteJoinModalOpen: boolean,
    isVoteCreationModalOpen: boolean
}

export class LobbyScreen extends React.PureComponent<{}, LobbyScreenState> {
    public constructor (props: {}) {
        super(props);
        this.state = {
            isVoteJoinModalOpen: false,
            isVoteCreationModalOpen: false
        }
    }

    public render = () => {
        return (
            <>
                <Header />
                <Divider style={{
                    marginTop: "3em",
                    marginBottom: "3em",
                    marginLeft: 72,
                    marginRight: 72,
                }}  />
                <VoteList />
                <VoteCreationButton onClick={() => this.setState({isVoteCreationModalOpen: true})} />
                <VoteCreationModal isOpen={this.state.isVoteCreationModalOpen} handleClose={() => this.setState({isVoteCreationModalOpen: false})} />
                <Footer />
            </>
        );
    }
}
