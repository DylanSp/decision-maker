import { TableCell, TableRow } from "@material-ui/core";
import { DragHandle } from "@material-ui/icons";
import * as React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { SortableElement } from 'react-sortable-hoc';

interface ChoiceDisplayProps {
    choiceName: string;
    rank: number;
}

const SortableDragHandle = SortableHandle(() => (
    <DragHandle />
));


// if we explicitly type this as an SFC, 
// we get type errors in SortableChoiceDisplay
const ChoiceDisplay = (props: ChoiceDisplayProps) => {
    return (
            <TableRow>
                <TableCell>
                    <SortableDragHandle />
                </TableCell>
                <TableCell>
                    {props.rank}
                </TableCell>
                <TableCell>
                    {props.choiceName}
                </TableCell>
            </TableRow>
    );
}

export const SortableChoiceDisplay = SortableElement(ChoiceDisplay);