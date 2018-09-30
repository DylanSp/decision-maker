import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import './index.css';
import { mainReducers } from './redux/reducers';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(mainReducers);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    ,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
