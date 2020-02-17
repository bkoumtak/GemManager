import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { UserManagement } from './components/UserManagement';
import { LoginPage } from './components/Login'; 
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
            <Route path='/login' component={LoginPage} />
            <PrivateRoute path='/user-management' roles={[Role.Admin]} component={UserManagement} />
            <PrivateRoute path='/add-user' roles={[Role.Admin]} component={AddUser} />
            <PrivateRoute path='/gem-transfer' component={GemTransfer} />
          </Layout>
      </>
    );
  }
}
