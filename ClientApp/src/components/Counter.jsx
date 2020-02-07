import React, { Component } from 'react';
import { Role } from '../_helpers/role'; 
import { authenticationService } from '../_services/authentication.service'

export class AddUser extends Component {
    static displayName = "Add User";

    constructor(props) {
        super(props);
        this.state = { user:'', username:'', password: '', users: [] };
        this.addUser = this.addUser.bind(this);
        this.handleChange = this.handleChange.bind(this); 
        this.handleChangeUsername = this.handleChangeUsername.bind(this); 
        this.handleChangePassword = this.handleChangePassword.bind(this); 
        this.authenticate = this.authenticate.bind(this); 
    }

    handleChange(e) {
        this.setState({
            user: e.target.value
        }); 
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

    addUser() {
        console.log(this.state.user); 
        fetch('api/user/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                name: this.state.user,
                rocks: 10
            })
        })
    }

    authenticate() {
        authenticationService.login(this.state.username, this.state.password).then(
            user => console.log(user)
        )
    }

    
    render() {
        let users = this.state.users.slice(); 
        const listOfUsers = users.map((user, index) =>
            <li key={index}>
                {user}
            </li>
        );

        return (
            <div>
                <h6> Add User </h6>
                <input type="text" onChange={this.handleChange} />
                <h6> Username: </h6>
                <input type="username" onChange={this.handleChangeUsername} />
                <h6> Password: </h6>
                <input type="password" onChange={this.handleChangePassword} />
                <div className="pt-2">
                <button className="btn btn-primary" onClick={this.addUser}>Add User</button>
                </div>

                <div className="pt-2">
                    <button className="btn btn-primary" onClick={this.authenticate}>Authenticate</button>
                </div>

                <div className="pt-2">
                    <ul> {listOfUsers} </ul>
                </div>

                <div> 
                    {Role.Admin}
                </div>
            </div>
        );
    }
}
