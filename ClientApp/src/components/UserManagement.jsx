import React, { Component } from 'react';
import { handleResponse } from '../_helpers';
import { v4 as uuidv4 } from 'uuid'; 
import { getWeekSince } from '../_helpers/week-helper';

export class UserManagement extends Component {
    static displayName = UserManagement.name;

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            userIndex: 0,
            cardIndex: 0,
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
                {users.map(user => {
                            if (user.name !== "Graveyard") {
                                return <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.gemsToGive}</td>
                                            <td align="center">
                                                <a style={{ cursor: 'pointer' }} onClick={() => addOrSubstractRocks(user.id, "+")}>+</a>
                                                |
                                                <a style={{ cursor: 'pointer' }} onClick={() => addOrSubstractRocks(user.id, "-")}>-</a>
                                            </td>
                                        </tr>
                            }
                        }
                    )}
                </tbody>
            </table>
        );
    }

    toUserChangeHandler(e) {
        let id = e.target.value;

        this.setState({
            userIndex: id
        });
    }

    cardChangeHandler(e) {
        let cardId = e.target.value;

        this.setState({
            cardIndex: cardId
        });
    }

    async addCard() {
        await fetch('api/card/', {
            method: 'POST',
            headers: {
                ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            },
            body: JSON.stringify({
                id: uuidv4(),
                week: getWeekSince(),
                owner: this.state.users[this.state.userIndex],
                cardType: parseInt(this.state.cardIndex)
            })
        })

        alert("Card submitted to user: " + this.state.users[this.state.userIndex].firstName); 
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : UserManagement.renderUsers(this.state.users, this.state.addOrSubstractRocks);

        let userList = this.state.users.map((user, index) => {
            if (user.role != "Admin") {
                return <option key={index} value={index}>{user.firstName}</option>
            }
        });

        let cardNames = ["Self Hug", "Robin Hood", "Steal Gem", "Steal Card", "Double Receive", "Double Send", "Revive", "Malediction"];

        let cardList = cardNames.map((card, index) => {
            return <option key={index} value={index}>{card}</option>
        });

        return (
            <div>
                <div className="row">
                    <div className="col-3">
                        <h1 id="tabelLabel">User Management</h1>
                    </div>
                    <div className="col-2">
                        <select className="form-control" onChange={this.toUserChangeHandler.bind(this)}>
                            {userList}
                        </select>  
                    </div> 
                    <div className="col-2"> 
                        <select className="form-control" onChange={this.cardChangeHandler.bind(this)}>
                            {cardList}
                        </select>  
                    </div>
                    <div className="col-2">
                        <button type="button" className="btn btn-outline-dark" onClick={this.addCard.bind(this)}>Add Card to User</button>
                    </div>
                    <div className="col-3" style={{ textAlign: 'center' }}>
                        <button type="button" className="btn btn-outline-dark" onClick={this.submit.bind(this)}>Add 2 Gems</button>
                    </div>
                </div>
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
                }
            }
        });
        const data = await response.json();
        this.setState({ users: data, loading: false });
    }

    submit() {
        fetch('api/user/add2gems',
                {
                    method: 'PUT',
                    headers: {
                        ...{
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    },
                })
            .then(handleResponse)
            .catch((error) => {
                alert(error);
            })
            .then(
                window.location.reload()
            );
    }

    async pushUserRocks(id, rocks) {
        console.log(id + ' ' + rocks);
        fetch('api/user/' + id, {
            method: 'PUT',
            headers: {
                ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            },
            body: JSON.stringify({
                id: id,
                gemsToGive: rocks
            })
        })
    }
}
