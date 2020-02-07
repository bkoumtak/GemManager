import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { UserManagement } from './components/UserManagement';
import { AddUser } from './components/Counter';
import { PrivateRoute } from './components/PrivateRoute'; 
import { Role } from './_helpers/role'; 

import './custom.css'
import { GemTransfer } from './components/GemTransfer';

export default class App extends Component {
  static displayName = App.name;

    render() {

      return (
      <>
          <Layout>
            <Route exact path='/' component={Home} />
            <PrivateRoute path='/user-management' role={[Role.Admin]} component={UserManagement} />
            <Route path='/add-user' component={AddUser} />
            <Route path='/gem-transfer' component={GemTransfer} />
          </Layout>
      </>
    );
  }
}
