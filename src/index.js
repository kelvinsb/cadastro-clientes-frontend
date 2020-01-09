/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './pages/inicial/index';
import * as serviceWorker from './serviceWorker';
import 'bulma/css/bulma.css';
import Header from './pages/inicial/parts/Header';

ReactDOM.render(
    <BrowserRouter>
        <Header />
        <Switch>
            <Route path="/" exact={true} component={App} />
            <Route path="/cadastrar" component={App} />
            <Route path="/editar" component={App} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
