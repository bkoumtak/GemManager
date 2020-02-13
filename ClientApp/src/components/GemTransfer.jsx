import React, { Component } from 'react';
import { authHeader, handleResponse } from '../_helpers';

export class GemTransfer extends Component {
    
    constructor(props) {
        super(props); 
        this.state = {
            users: [],
            loading: true,
            fromUser: 0,
            toUser: 0,
            gemsToGive: 0,
            gemsToTransfer: 0
        }
    }

    componentDidMount() {
        this.populateUsers();
    }

    fromUserChangeHandler(event) {
        let id = event.target.value;
        this.setState({ fromUser: id, gemsToGive: this.state.users.find(x => x.id == id).gemsToGive });
        console.log(this.state.gemsToGive); 
    }

    toUserChangeHandler(event) {
        //console.log('to called'); 
        this.setState({ toUser: event.target.value });
    }

    transferGem(event) {
        const baseUrl = 'api/user/'; 

        let fromId = this.state.fromUser; 
        let toId = this.state.toUser;

        let user1 = this.state.users.find(x => x.id == fromId).name; 
        let user2 = this.state.users.find(x => x.id == toId).name;

        let totalGemsToGive = this.state.users.find(x => x.id == fromId).gemsToGive; 
        let gemsToTransfer = this.state.gemsToTransfer; 

        if (gemsToTransfer > totalGemsToGive) {
            alert(user1 + ' does not have enough gems to give. ')
        }
        else {
            alert(user1 + ' has transferred ' + gemsToTransfer + ' gems to ' + user2);
            let newUsers = this.state.users.slice(); 
            newUsers.find(x => x.id == fromId).gemsToGive -= gemsToTransfer; 
            newUsers.find(x => x.id == toId).totalGems += gemsToTransfer; 
            this.setState({ users: newUsers }); 

            let user1Url = baseUrl + fromId; 
            let user2Url = baseUrl + toId; 
            
            fetch(user1Url, {
                method: 'PUT',
                headers: {
                    ...{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    ...authHeader()
                },
                body: JSON.stringify(newUsers.find(x => x.id == fromId))
            }); 

            fetch(user2Url, {
                method: 'PUT',
                headers: {
                    ...{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    ...authHeader()
                },
                body: JSON.stringify(newUsers.find(x => x.id == toId))
            }); 

        }
    }

    transferGemChangeHandler(event) {
        this.setState({ gemsToTransfer: +event.target.value });
    }
    renderUsers(users) {
        let list = users.map(user =>
            <option key={user.id} value={user.id}>{user.name}</option>
        );

        return (
            <>
                <div className="form-inline" >
                    <label className="mr-sm-2" htmlFor="fromUser">From: </label>
                    <select className="form-control mr-sm-2" id="fromUser" onChange={this.fromUserChangeHandler.bind(this)}>
                        {list}
                    </select>
                
                    <label className="mr-sm-2" htmlFor="toUser">To: </label>
                    <select className="form-control mr-sm-2" id="toUser" onChange={this.toUserChangeHandler.bind(this)}>
                        {list}
                    </select>

                    <label className="mr-sm-2" htmlFor="transfer">Gems to Transfer: </label>
                    
                    <input type="text" className="form-control mr-sm-2" id="transfer" placeholder="0"
                        onChange={this.transferGemChangeHandler.bind(this)} />

                    <button type="submit" className="btn btn-primary" onClick={this.transferGem.bind(this)}>Submit</button>
                </div>
            </>
        );
    }

    render() {
        //console.log(this.state.fromUser);
        //console.log(this.state.toUser);
    
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderUsers(this.state.users); 

        if (!this.state.users.length)
            contents = <p><em>No users on list</em></p>

        return (
            <div>
                {contents}
            </div>
        )
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
            },
        }); 
        const data = await response.json(); 
        if (data.length > 0) 
            this.setState({ users: data, loading: false });
    }
}