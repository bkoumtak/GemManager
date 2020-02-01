import React, { Component } from 'react';

export class UserManagement extends Component {
    static displayName = "User Management";

    constructor(props) {
        super(props);
        this.state = { user:'', users: [] };
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
                rocks: 1
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
            <input type="text" onChange={this.handleChange}/>
                <div className="pt-2">
                <button className="btn btn-primary" onClick={this.addUser}>Add User</button>
                </div>

                <div className="pt-2">
                    <ul> {listOfUsers} </ul>
                </div>
            </div>
        );
    }
}