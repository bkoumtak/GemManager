import React from 'react'; 
import { Route, Redirect } from 'react-router-dom'; 

import { authenticationService } from '../_services/authentication.service'

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = authenticationService.currentUserValue; 
        if (!currentUser) {
            return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        }

        if (roles && roles.indexOf(currentUser.role) === -1) {
            return <Redirect to={{ pathname: '/' }} />
        }
        return <Component {...props} />
    }} />
)