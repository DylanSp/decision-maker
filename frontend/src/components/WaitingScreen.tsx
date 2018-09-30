import { PureComponent } from 'react';
import * as React from 'react';
import { WaitingSpinner } from './WaitingSpinner';

export class WaitingScreen extends PureComponent {
    public render = () => (
        <WaitingSpinner />
    );
}