import { Button, Divider, Typography } from "@material-ui/core";
import Axios from "axios";
import { VoteDetails } from 'common';
import { PureComponent } from "react";
import * as React from 'react';
import { arrayMove } from 'react-sortable-hoc';
import { backendUrl } from 'src/BackendUrl';
import { ChoiceRanker } from './ChoiceRanker';

interface VotingScreenProps {
    voteHashid: string;
}

interface VotingScreenState {
    voteDetails?: VoteDetails;
    rankedChoices: string[]
}

export class VotingScreen extends PureComponent<VotingScreenProps, VotingScreenState> {
    public constructor(props: VotingScreenProps) {
        super(props);
        this.state = {
            voteDetails: undefined,
            rankedChoices: []
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
            },
            rankedChoices: [
                "Viticulture",
                "Machi Koro",
                "Monopoly"
            ]
        });
    }


    public render = () => {

        if (this.state.voteDetails) {
            return (
                <>
                    <Typography
                        align="center"
                        variant="h4"
                        style={{
                            marginTop: "0.5em"
                        }}
                    >
                        Voting for: {this.state.voteDetails.name}
                    </Typography>
                    <Divider style={{
                        marginTop: "2em",
                        marginBottom: "1em",
                        marginLeft: 72,
                        marginRight: 72,
                    }}  />
                    <ChoiceRanker
                        choices={this.state.rankedChoices}
                        rerankChoices={this.rearrangeRankedChoices}
                    />
                    <Divider style={{
                        marginTop: "1em",
                        marginBottom: "2em",
                        marginLeft: 72,
                        marginRight: 72,
                    }}  />
                    <div style={{textAlign: "center"}}>
                        <Button variant="contained" size="large" color="primary" onClick={this.submitVote}>
                            Submit Vote
                        </Button>
                    </div>
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

    private submitVote = async () => {
        const submitUrl = `${backendUrl}/votes/${this.props.voteHashid}/ballots`;
        await Axios.post(submitUrl, this.state.rankedChoices);
        // check response; if success (should be 204), redirect to WaitingScreen
    }

    private rearrangeRankedChoices = (oldIndex: number, newIndex: number) => {
        this.setState((state) => ({
            rankedChoices: arrayMove(state.rankedChoices, oldIndex, newIndex)
        }));
    }
}