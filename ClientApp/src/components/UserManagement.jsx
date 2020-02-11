import React, { Component } from 'react';
import { authHeader, handleResponse } from '../_helpers';

export class UserManagement extends Component {
    static displayName = UserManagement.name;

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            addOrSubstractRocks: (id, operation) => {
                const users = this.state.users.slice();

                let user = users.find(x => x.id == id);

                if (user.gemsToGive <= 0 && operation === "-") {
                    return;
                }

                if (operation === "+") {
                    user.gemsToGive += 1;
                } else {
                    user.gemsToGive -= 1;
                }

                console.log(user);

                this.setState({ users: users });

                this.pushUserRocks(user.id, user.gemsToGive);
            }
        };
    }

    componentDidMount() {
        this.populateUsers();
    }

    static renderUsers(users, addOrSubstractRocks) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Number of Rocks</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user =>
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.gemsToGive}</td>
                            <td align="center"><a onClick={() => addOrSubstractRocks(user.id, "+")}>+</a> | <a onClick={() => addOrSubstractRocks(user.id, "-")}>-</a></td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : UserManagement.renderUsers(this.state.users, this.state.addOrSubstractRocks);

        return (
            <div>
                <h1 id="tabelLabel">User Management</h1>
                {contents}
            </div>
        );
    }

    async populateUsers() {
        const response = await fetch('api/user', {
            method: 'GET',
            headers: {
                ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                ...authHeader()
            }
        });
        const data = await response.json();
        this.setState({ users: data, loading: false });
    }

    async pushUserRocks(id, rocks) {
        console.log(id + ' ' + rocks);
        fetch('api/user/' + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                gemsToGive: rocks
            })
        })
    }
}
