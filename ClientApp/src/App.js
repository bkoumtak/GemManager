import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { UserManagement } from './components/UserManagement';
import { LoginPage } from './components/Login'; 
import { AddUser } from './components/Counter';
import { PrivateRoute } from './components/PrivateRoute'; 
import { Role } from './_helpers/role'; 

import './custom.css';
import { UserPage } from './components/UserPage';
import { GemsReceived } from './components/GemsReceived';
import { GemsSent } from './components/GemsSent';
import { WeekDisplay } from './components/WeekDisplay';
import { CardPage } from './components/CardPage';

export default class App extends Component {
  static displayName = App.name;

    render() {
      return (
      <>
          <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/login' component={LoginPage} />
            <Route path='/weekly' component={WeekDisplay} />
            <PrivateRoute path='/card-page' component={CardPage}/>
            <PrivateRoute path='/user-page' component={UserPage} />
            <PrivateRoute path='/gems-received-page' component={GemsReceived} />
            <PrivateRoute path='/gems-sent-page' component={GemsSent} />
            <PrivateRoute path='/user-management' roles={[Role.Admin]} component={UserManagement} />
          </Layout>
      </>
    );
  }
}
