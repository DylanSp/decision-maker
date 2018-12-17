import { List, Typography } from '@material-ui/core';
import { SFC } from 'react';
import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import { SortableChoiceDisplay } from './ChoiceDisplay';

interface ChoiceDisplayListProps {
    items: string[];
}

// if we explicitly type this as an SFC, 
// we get type errors in SortableChoiceDisplayList
const ChoiceDisplayList = (props: ChoiceDisplayListProps) => {
    return (
        <List>
            <Typography align="center" variant="h6">
                Most preferred option!
            </Typography>
            {props.items.map((choice, index) => (
                <SortableChoiceDisplay key={`item-${index}`} index={index} choiceName={choice} />
            ))}
            <Typography align="center" variant="h6">
                Least preferred option!
            </Typography>
        </List>
    );
};

const SortableChoiceDisplayList = SortableContainer(ChoiceDisplayList);

interface ChoiceRankerProps {
    choices: string[];
    rerankChoices: (oldIndex: number, newIndex: number) => void;
}

export const ChoiceRanker: SFC<ChoiceRankerProps> = (props) => (
    <SortableChoiceDisplayList
        items={props.choices}
        useDragHandle={false}
        onSortEnd={({oldIndex, newIndex}) => (
            props.rerankChoices(oldIndex, newIndex)
        )}
    />
);