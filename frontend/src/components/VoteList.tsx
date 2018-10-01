import { AxiosStatic } from "axios";
import { VoteSummaryResponse } from "common";
import * as React from 'react';
import { VoteRow } from './VoteRow';

const pollInterval = 2 * 1000;

export interface VoteSummary {
    name: string,
    hashid: string
}

export interface VoteListProps {
    fetcher: AxiosStatic
}

export interface VoteListState {
    voteList: VoteSummary[],
    isPolling: boolean
}

export class VoteList extends React.Component<VoteListProps, VoteListState> {
    public constructor (props: VoteListProps) {
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
    }

    public render = () => (
        <>
            {this.state.voteList.map((summary, index) => <VoteRow key={index} {...summary} />)}
        </>
    );

    private fetchVoteSummaries = async (): Promise<void> => {
        // TODO - figure out how to set version as a const, refer to that from components
        const response = VoteSummaryResponse.decode(await this.props.fetcher.get("/api/v0.1/votes"));
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
