import { Card, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { DragHandle } from "@material-ui/icons";
import * as React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { SortableElement } from 'react-sortable-hoc';

interface ChoiceDisplayProps {
    choiceName: string;
}

const SortableDragHandle = SortableHandle(() => (
    <DragHandle />
));


// if we explicitly type this as an SFC, 
// we get type errors in SortableChoiceDisplay
const ChoiceDisplay = (props: ChoiceDisplayProps) => {
    return (
        <Card style={{
            marginTop: "0.5em",
            marginBottom: "0.5em"
        }}>
            <ListItem>
                <ListItemIcon>
                    <SortableDragHandle/>
                </ListItemIcon>
                <ListItemText>
                    {props.choiceName}
                </ListItemText>
            </ListItem>
        </Card>
    );
}

export const SortableChoiceDisplay = SortableElement(ChoiceDisplay);