import { VoteSummary } from '../components/VoteList';
import { Action } from './types';

export const startFetchingSummaries = (): Action => {
    return {
        type: "StartPollingVoteSummary"
    }
}

export const stopFetchingSummaries = (): Action => {
    return {
        type: "StopPollingVoteSummary"
    }
}

export const setVoteSummaries = (summaries: VoteSummary[]): Action => {
    return {
        type: "VoteSummaryUpdated",
        payload: summaries
    }
}