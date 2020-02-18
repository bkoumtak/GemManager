import React, { Component } from 'react';
import { authHeader, handleResponse } from '../_helpers';
import { authenticationService } from '../_services/authentication.service'

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
        if (authenticationService.currentUserValue)
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
        let contents; 
        if (!authenticationService.currentUserValue) {
            contents = <p><em>You're not logged in to the webiste...</em></p>
        } else {
            contents = this.state.loading
                        ? <p><em>Loading...</em></p>
                        : Home.renderUsers(this.state.users);
        }        

        return (
            <div>
                <h1 id="tabelLabel">User Rankings</h1>
                {contents}
            </div>
        );
    }



    async populateUsers() {
        const response = await fetch('api/user',
            {
                method: 'GET',
                headers: authHeader()
            }).then(handleResponse);
        
        var sortable = []; 
        for (var obj in response) {
            sortable.push(response[obj]); 
        }

        sortable.sort(this.totalGemsSort); 

        if (response.length > 0)
            this.setState({ users: sortable, loading: false });
    }

    totalGemsSort(a, b) {
        if (a.totalGems > b.totalGems) return -1;
        if (a.totalGems < b.totalGems) return 1;
        return 0;
    }
}
