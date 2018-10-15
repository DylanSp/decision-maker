import { VoteDetails } from 'common';
import { PureComponent } from "react";
import * as React from 'react';
import { ChoiceRanker } from './ChoiceRanker';

interface VotingScreenProps {
    voteHashid: string;
}

interface VotingScreenState {
    voteDetails?: VoteDetails
}

export class VotingScreen extends PureComponent<VotingScreenProps, VotingScreenState> {
    public constructor(props: VotingScreenProps) {
        super(props);
        this.state = {
            voteDetails: undefined
        }
    }

    public componentDidMount = () => {
        // fetch vote details from backend at /api/(version)/votes/${this.props.voteHashid}
        // attempt to decode with VoteDetailsResponse.decode(),
        // if response validates, assign value to this.state.voteDetails

        // mock data for manual testing
        this.setState({
            voteDetails: {
                hashid: this.props.voteHashid,
                isOpen: true,
                name: "test vote",
                numVoters: 3,
                choices: [
                    "Viticulture",
                    "Machi Koro",
                    "Monopoly"
                ],
                password: "testpass"
            }
        });
    }


    public render = () => {

        if (this.state.voteDetails) {
            return (
                <>
                    <ChoiceRanker choices={this.state.voteDetails.choices} />
                </>
                // submit button
            );
        } else {
            return ( // TODO - replace with proper placeholder, or perhaps just leave empty
                <>
                    No vote loaded yet, sorry! :(
                </>
            );
        }
    }
}