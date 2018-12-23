import { List, Typography } from '@material-ui/core';
import Axios from "axios";
import { VoteSummaryResponse } from "common";
import * as React from 'react';
import { backendUrl } from '../BackendUrl';
import { VoteRow } from './VoteRow';

const pollInterval = 2 * 1000;

export interface VoteSummary {
    name: string,
    hashid: string
}

export interface VoteListState {
    voteList: VoteSummary[],
    isPolling: boolean
}

export class VoteList extends React.Component<{}, VoteListState> {
    public constructor (props: {}) {
        super(props);
        this.state = {
            voteList: [],
            isPolling: false
        }
    }

    public componentDidMount = () => {
        this.setState({
            isPolling: true
        });

        // will repeat, polling /votes on the backend until component unmounts
        this.fetchVoteSummaries();
    }

    public componentWillUnmount = () => {
        this.setState({
            isPolling: false
        });
        // TODO - cancel any outstanding requests
    }

    public render = () => (
        // TODO - something in case there are no votes?
        <div>
            <Typography align="center" variant="h5">
                Votes in Progress
            </Typography>
            <List>
                {this.state.voteList.map((summary, index) => (
                    <VoteRow key={index} {...summary}/>
                ))}
            </List>
        </div>
    );

    private fetchVoteSummaries = async (): Promise<void> => {
        const votesUrl = `${backendUrl}/votes`;
        const response = VoteSummaryResponse.decode((await Axios.get(votesUrl)).data);
        if(response.isLeft()) {
            // TODO - handle error somehow
        } else {
            this.setState({
                voteList: response.value
            });
        }
        if(this.state.isPolling) {
            setTimeout(async () => this.fetchVoteSummaries(), pollInterval);
        }
    }
}
