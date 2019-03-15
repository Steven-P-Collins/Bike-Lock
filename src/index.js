import React from 'react';
import ReactDOM from 'react-dom';
import Header from './App';
import Login from './Javascript/Login';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Header />, document.getElementsByClassName('header')[0]);
ReactDOM.render(<Login />, document.getElementsByClassName('login')[0]);
// ReactDOM.render(<Form />, document.getElementsByClassName('form')[0]);

serviceWorker.unregister();
