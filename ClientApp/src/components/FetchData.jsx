import React, { Component } from 'react';

export class FetchData extends Component {
    static displayName = FetchData.name;

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            addOrSubstractRocks: (id, operation) => {
                const users = this.state.users.slice();

                let user = users.find(x => x.id == id);

                if (user.rocks <= 0 && operation === "-") {
                    return;
                }

                if (operation === "+") {
                    user.rocks += 1;
                } else {
                    user.rocks -= 1;
                }

                console.log(user);

                this.setState({ users: users });

                this.pushUserRocks(user.id, user.rocks);
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
                            <td>{user.rocks}</td>
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
            : FetchData.renderUsers(this.state.users, this.state.addOrSubstractRocks);

        return (
            <div>
                <h1 id="tabelLabel" >User Management</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
            </div>
        );
    }

    async populateUsers() {
        const response = await fetch('api/user');
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
                rocks: rocks
            })
        })
    }
}
