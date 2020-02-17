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
import { UserPage } from './components/UserPage';
import { GemsReceived } from './components/GemsReceived';
import { GemsSent } from './components/GemsSent';

export default class App extends Component {
  static displayName = App.name;

    render() {
      return (
      <>
          <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/login' component={LoginPage} />
            <PrivateRoute path='/user-page' roles={[Role.User]} component={UserPage} />
            <PrivateRoute path='/gems-received-page' roles={[Role.User]} component={GemsReceived} />
            <PrivateRoute path='/gems-sent-page' roles={[Role.User]} component={GemsSent} />
            <PrivateRoute path='/user-management' roles={[Role.Admin]} component={UserManagement} />
          </Layout>
      </>
    );
  }
}
