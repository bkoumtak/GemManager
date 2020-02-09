import React from 'react'; 

import { authenticationService } from '../_services/authentication.service'; 

export class LoginPage extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            username: '',
            password: '',
        };

        if (authenticationService.currentUserValue) {
            this.props.history.push('/'); 
        }

        this.handleChangeUsername = this.handleChangeUsername.bind(this); 
        this.handleChangePassword = this.handleChangePassword.bind(this); 
        this.authenticate = this.authenticate.bind(this); 
    }

    handleChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    handleChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    authenticate() {
        authenticationService.login(this.state.username, this.state.password).then(
            user => {
                console.log(user); 
                this.props.history.push('/');
            }); 
    }

    render() {
        return (
            <>
                <h6> Username: </h6>
                <input type="username" onChange={this.handleChangeUsername} />
                <h6> Password: </h6>
                <input type="password" onChange={this.handleChangePassword} />
                <div className="pt-2">
                    <button className="btn btn-primary" onClick={this.authenticate}>Authenticate</button>
                </div>
            </>
        );
    }
}

