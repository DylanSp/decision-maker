import * as React from 'react';
import './App.css';
import { VotingScreen } from './components/VotingScreen';

class App extends React.Component {
    public render() {
        return (
            <VotingScreen voteHashid="abcde" />
        );
    }
}

export default App;
