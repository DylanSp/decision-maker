import * as React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { SortableElement } from 'react-sortable-hoc';

interface ChoiceDisplayProps {
    choiceName: string;
}

// if we explicitly type this as an SFC, 
// we get type errors in SortableDragHandle 
const DragHandle = () => (
    <span>
        ::
    </span>
);

const SortableDragHandle = SortableHandle(DragHandle);

// if we explicitly type this as an SFC, 
// we get type errors in SortableChoiceDisplay
const ChoiceDisplay = (props: ChoiceDisplayProps) => {
    return (
        <li>
            <SortableDragHandle />
            {props.choiceName}
        </li>
    );
}

export const SortableChoiceDisplay = SortableElement(ChoiceDisplay);