import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { UserManagement } from './components/Counter';

import './custom.css'
import { GemTransfer } from './components/GemTransfer';

export default class App extends Component {
  static displayName = App.name;

    render() {

      return (
      <>
          <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/counter' component={UserManagement} />
            <Route path='/fetch-data' component={FetchData} />
            <Route path='/gem-transfer' component={GemTransfer} />
          </Layout>
      </>
    );
  }
}
