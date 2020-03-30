import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { history } from './_helpers/history'; 

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router basename={baseUrl} history={history}>
    <App />
  </Router>,
  rootElement);

registerServiceWorker();

