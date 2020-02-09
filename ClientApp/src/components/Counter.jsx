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
    }

    handleChange(e) {
        this.setState({
            user: e.target.value
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

                <div>
                <button className="btn btn-primary" onClick={this.addUser}>Add User</button>
                </div>

                <div className="pt-2">
                    <ul> {listOfUsers} </ul>
                </div>
            </div>
        );
    }
}
