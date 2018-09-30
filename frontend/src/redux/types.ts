type Choice = string;

interface VoteSummary {
    readonly name: string,
    readonly hashid: string
}

export interface StoreShape {
    readonly isPollingVoteSummary: boolean,
    readonly votesInProgress: VoteSummary[],
    readonly choicesToCreate: Choice[],
    readonly choiceRanking: Choice[],
    readonly isVoteComplete: boolean,
    readonly completeVoteName: string,
    readonly winningChoice: Choice
}

type ActionType = "VoteSummaryUpdated"
                | "StartPollingVoteSummary"
                | "StopPollingVoteSummary"

type Payload = VoteSummary[]

export interface Action {
    type: ActionType,
    payload?: Payload
}
