import * as React from 'react';
import { VoteRow } from './VoteRow';

export interface VoteSummary {
    name: string,
    hashid: string
}

export interface VoteListProps {
    voteList: VoteSummary[],
    fetchVoteSummaries: () => void,
    startFetchingSummaries: () => void,
    stopFetchingSummaries: () => void
}

export class VoteList extends React.Component<VoteListProps, {}> {
    public constructor (props: VoteListProps) {
        super(props);
    }

    public componentDidMount = () => {
        this.props.startFetchingSummaries();

        // will repeat, polling /votes on the backend until component unmounts
        this.props.fetchVoteSummaries();
    }

    public componentWillUnmount = () => {
        this.props.stopFetchingSummaries();
    }

    public render = () => (
        <>
            {this.props.voteList.map((summary, index) => <VoteRow key={index} {...summary} />)}
        </>
    );
}
