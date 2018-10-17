import { List } from '@material-ui/core';
import { PureComponent } from 'react';
import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { arrayMove } from 'react-sortable-hoc';
import { SortableChoiceDisplay } from './ChoiceDisplay';

interface ChoiceDisplayListProps {
    items: string[];
}

const ChoiceDisplayList = (props: ChoiceDisplayListProps) => {
    return (
        <List>
            {props.items.map((choice, index) => (
                <SortableChoiceDisplay key={`item-${index}`} index={index} choiceName={choice} />
            ))}
        </List>
    );
};

const SortableChoiceDisplayList = SortableContainer(ChoiceDisplayList);

interface ChoiceRankerProps {
    choices: string[];
}

interface ChoiceRankerState {
    rankedChoices: string[];
}

interface IndexChange {
    oldIndex: number,
    newIndex: number
}

export class ChoiceRanker extends PureComponent<ChoiceRankerProps, ChoiceRankerState> {
    public constructor (props: ChoiceRankerProps) {
        super(props);
        this.state = {
            rankedChoices: props.choices
        };
    }

    public render = () => (
        <SortableChoiceDisplayList
            items={this.state.rankedChoices}
            onSortEnd={this.onSortEnd}
            useDragHandle={false}
        />
    )

    private onSortEnd = ({oldIndex, newIndex}: IndexChange) => {
        this.setState((state) => ({
            rankedChoices: arrayMove(state.rankedChoices, oldIndex, newIndex)
        }));
    };
}
