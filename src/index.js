/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './pages/inicial/index';
import * as serviceWorker from './serviceWorker';
import 'bulma/css/bulma.css';
import Header from './pages/inicial/parts/Header';
import Cadastrar from './pages/cadastrar';
import './index.css';

ReactDOM.render(
    <BrowserRouter>
        <Header />
        <section className="section">
            <div className="container">
                <Switch>
                    <Route path="/" exact={true} component={App} />
                    <Route key="cadastrar" path="/cadastrar" component={Cadastrar} />
                    <Route key="editar" path="/editar/:id" component={Cadastrar} />
                </Switch>
            </div>
        </section>
    </BrowserRouter>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
