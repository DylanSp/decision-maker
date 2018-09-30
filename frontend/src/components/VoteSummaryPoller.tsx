import axios from "axios";
import { Left } from 'fp-ts/lib/Either';
import { VoteSummaryResponse } from "io-types/VotePayloads";
import { connect } from "react-redux";
import { Dispatch } from 'redux';
import { setVoteSummaries, startFetchingSummaries, stopFetchingSummaries } from '../redux/actions';
import { StoreShape } from '../redux/types';
import { VoteList } from './VoteList';

const mapStateToProps = (state: StoreShape) => {
    return {
        voteList: state.votesInProgress
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        startFetchingSummaries: () => {
            dispatch(startFetchingSummaries());
        },
        stopFetchingSummaries: () => {
            dispatch(stopFetchingSummaries());
        },
        fetchVoteSummaries: async () => {
            // TODO - need to have version stored in a const somewhere for methods to reference
            const response = VoteSummaryResponse.decode(await axios.get("/api/v0.1/votes"));
            if (response instanceof Left) {
                // TODO - handle error somehow
            } else {
                dispatch(setVoteSummaries(response.value));
            }
        }
    }
}

export const VoteSummaryPoller = connect(
    mapStateToProps,
    mapDispatchToProps
)(VoteList);





/*
export class VoteList extends React.Component<{}, VoteListState> {
    
    public componentDidMount = async (): Promise<void> => {
        const votesResponse = VoteSummaryResponse.decode(await axios.get("/votes"));
        if(votesResponse instanceof Left) {
            // TODO - handle error somehow
        } else {
            /*
            this.setState({
                voteList: votesResponse.value
            })
            */
           /*
            // TODO - dispatch action via Redux
        }
    }

    public render() {
        return (
            <>
                <h2>
                    {this.state.voteList.map(summary => (
                        <VoteRow {...summary} />
                    ))}
                </h2>
            </>
        );
    }
}
*/
