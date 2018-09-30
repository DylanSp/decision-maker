import { SFC } from 'react';
import * as React from 'react';
import { ChoiceCreationList } from './ChoiceCreationList';
import { VoteCreationForm } from './VoteCreationForm';

export const VoteCreationModal: SFC<{}> = () => {
    return (
        <>
            <VoteCreationForm />
            <ChoiceCreationList />
            {
                // submit button
                // cancel button
            }
        </>
    );
}