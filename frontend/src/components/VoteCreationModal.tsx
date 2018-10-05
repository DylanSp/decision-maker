import { Dialog } from '@material-ui/core';
import { SFC } from 'react';
import * as React from 'react';
import { ChoiceCreationList } from './ChoiceCreationList';
import { VoteCreationForm } from './VoteCreationForm';

interface VoteCreationModalProps {
    isOpen: boolean,
    handleClose: () => void
}

export const VoteCreationModal: SFC<VoteCreationModalProps> = (props) => {
    return (
        <Dialog open={props.isOpen} onClose={props.handleClose}>
            <div>
                <VoteCreationForm />
                <ChoiceCreationList />
                {
                    // submit button
                    // cancel button
                }
            </div>
        </Dialog>
    );
}
