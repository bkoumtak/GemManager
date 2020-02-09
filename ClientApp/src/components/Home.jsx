import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: true
        };
        this.totalGemsSort = this.totalGemsSort.bind(this); 
    }

    componentDidMount() {
        this.populateUsers();
    }

    static renderUsers(users) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Rocks to give</th>
                        <th style={{ textAlign: 'center' }}>Total Gems</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user =>
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.gemsToGive}</td>
                            <td align="center">{user.totalGems}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Home.renderUsers(this.state.users);

        return (
            <div>
                <h1 id="tabelLabel">User Rankings</h1>
                {contents}
            </div>
        );
    }



    async populateUsers() {
        const response = await fetch('api/user', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }); 
        const data = await response.json();

        var sortable = []; 
        for (var obj in data) {
            sortable.push(data[obj]); 
        }

        sortable.sort(this.totalGemsSort); 

        if (data.length > 0)
            this.setState({ users: sortable, loading: false });
    }

    totalGemsSort(a, b) {
        if (a.totalGems > b.totalGems) return -1;
        if (a.totalGems < b.totalGems) return 1;
        return 0;
    }
}
