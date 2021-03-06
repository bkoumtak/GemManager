import React, { Component } from 'react';
import { handleResponse } from '../_helpers';
import { authenticationService } from '../_services/authentication.service'

export class Home extends Component {
    static displayName = Home.name;
    

    constructor(props) {
        super(props);
        this.state = {
            gems: [],
            users: [],
            loading: true
        };
        this.totalGemsSort = this.totalGemsSort.bind(this); 
    }

    componentDidMount() {
        authenticationService.login().then(() => {
            if (authenticationService.currentUserValue) {
                this.populateUsers();
            }
        });
    }

    async populateRocks() {
        const response = await fetch('api/gem', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (data.length > 0) {
            this.setState({
                gems: data,
                loading: false
            });
        }
    }

    static renderUsers(users) {
        let n = 0;
        let graveyard = users.find(x => x.name == "Graveyard");
        let tfoot = <tfoot></tfoot>;

        let user = users.find(x => x.id == authenticationService.currentUserValue.id);
        let usersWithoutGraveyard = users.filter(x => x != graveyard);
        let userStats = <tr></tr>;
        
        if (graveyard)
            tfoot = <tfoot>
                    <tr>
                        <td>{graveyard.name}</td>
                        <td></td>
                        <td style={{ textAlign: 'center' }}>{graveyard.totalGems}</td>
                    </tr>
            </tfoot>;

        if (user)
            userStats = <tr>
                            <td><b>{(usersWithoutGraveyard.indexOf(user) + 1) + '. ' + user.name}</b></td>
                            <td style={{ textAlign: 'center' }}>{user.gemsToGive}</td>
                            <td style={{ textAlign: 'center' }}>{user.totalGems}</td>
                        </tr>

        return (
            <>
                <h1 id="dashboardLabel">Dashboard</h1>
                <table className='table table-striped' aria-labelledby="dashboardLabel">
                    <thead>
                    <tr>
                        <th></th>
                         <th style={{ textAlign: 'center' }}>Gems to give</th>
                        <th style={{ textAlign: 'center' }}>Total Gems</th>
                    </tr>
                    </thead>
                    <tbody>
                        {userStats}
                    </tbody>
                </table>

                <br/>

                <h1 id="tabelLabel">Top 3 Users</h1>

                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th style={{ textAlign: 'center' }}>Gems to give</th>
                            <th style={{ textAlign: 'center' }}>Total Gems</th>
                        </tr>
                    </thead>
                    <tbody>
                        {   
                            users.map(user => {

                                    if (n >= 3)
                                        return;

                                    if (user.name != "Graveyard") {
                                        return <tr key={user.id}>
                                                   <td>{++n + '. ' + user.name}</td>
                                                   <td align="center">{user.gemsToGive}</td>
                                                   <td align="center">{user.totalGems}</td>
                                               </tr>
                                    }
                            })
                        }
                        
                    </tbody>
                    {tfoot}
                </table>
            </>
        );
    }

    render() {
        let contents; 
        if (authenticationService.currentUserValue) {
            contents = this.state.loading
                        ? <p><em>Loading...</em></p>
                        : Home.renderUsers(this.state.users);
        }        

        return (
            <div>
                {contents}
            </div>
        );
    }
    
    async populateUsers() {
        const response = await fetch('api/user',
            {
                method: 'GET'
            }).then(handleResponse);

        await this.populateRocks();
        
        var sortable = []; 
        for (var obj in response) {
            sortable.push(response[obj]); 
        }

        sortable.map(x => { x.totalGems = this.state.gems.filter(y => y.to.id == x.id).length });
        
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
