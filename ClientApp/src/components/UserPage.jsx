import React from 'react'; 
import { v4 as uuidv4 } from 'uuid'; 
import { authenticationService } from '../_services/authentication.service'; 
import { getWeekSince } from '../_helpers/week-helper';
import { authHeader, handleCardControllerResponse } from '../_helpers';

export class UserPage extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            users: [],
            loading: true,
            toUserIndex: 1,
            currentUser: null, 
            dropDownClicked: false, 
            currentTextMessage: ""
        };
    }

    componentDidMount() {
        this.populateUsers(); 
    }

    toUserChangeHandler(event) {
        let id = event.target.value;

        if (this.state.users[id].name == "Graveyard") {
            this.setState({
                currentTextMessage: "n/a"
            });
        }

        this.setState({
            toUserIndex: id, 
            dropDownClicked: true
        })
    }

    textMessageChangeHandler(event) {
        let text = event.target.value; 

        console.log(text); 

        this.setState({
            currentTextMessage: text
        })
    }

    submitChoice() {
        let currentUser = this.state.currentUser;
        if (currentUser.gemsToGive > 0) {
            currentUser.gemsToGive -= 1;
        }
        else {
            alert("You don't have enough gems to give to " + this.state.users[this.state.toUserIndex].name);
            return;
        }

        this.setState({
            currentUser: currentUser
        });

        let toUser = this.state.users[this.state.toUserIndex]; 
        let guid = uuidv4();
        fetch('api/gem', {
            method: 'POST',
            headers: {
                ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                ...authHeader()
            },
           body: JSON.stringify({
               id: guid,
               week: getWeekSince(),
               from: {
                   id: currentUser.id
               },
               to: {
                   id: toUser.id
               },
               message: this.state.currentTextMessage
            }),
       })
        .then(handleCardControllerResponse)
        .then(obj => {
                alert(obj.message + this.state.users[this.state.toUserIndex].name);

                fetch('api/user/' + currentUser.id,
                    {
                        method: 'PUT',
                        headers: {
                            ...{
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            ...authHeader()
                        },
                        body: JSON.stringify({
                            id: currentUser.id,
                            gemsToGive: currentUser.gemsToGive
                        })
                    });
        })
        .catch((error) => {
            alert(error);
        });
    }

    renderUserPage(users) {
        let currentUser = this.state.currentUser; 
 
        let list = users.map((user,index) => {
            if (user.id != currentUser.id) {
                return <option key={index} value={index}>{user.name}</option>
            }
        });

        var i;
        let toUserIndex = this.state.toUserIndex;

        let msg;

        if (this.state.users[toUserIndex].name != "Graveyard") {
           msg = <div className="form-group">
            <label htmlFor="reasonTextArea">Why are you giving this gem to {this.state.users[toUserIndex]
                .name} ?</label>
            <textarea className="form-control" id="reasonTextArea" rows="3" onChange={this
                .textMessageChangeHandler.bind(this)}></textarea>
        </div>
        } else {
            msg = <div className="form-group"></div>;
        }
        return (
            <>
                <h1> Hi {currentUser.firstName}! </h1>
                <h1> <em>You currently have {this.state.currentUser.gemsToGive? currentUser.gemsToGive: <>no</>} gems to give this week. </em></h1> 

                { this.state.currentUser.gemsToGive > 0 && 
                    <>
                        <label className="mr-sm-2" htmlFor="toUser">Give a gem to: </label>
                        <select className="form-control mr-sm-2" id="toUser" onChange={this.toUserChangeHandler.bind(this)}>
                            {list}
                        </select>  

                        {msg}

                        <button type="button" className="btn btn-outline-dark" onClick={this.submitChoice.bind(this)}>Submit this gem</button>
                    </>
                }
            </>
        ); 
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderUserPage(this.state.users);

        console.log(this.state.users); 

        return (
            <div>
                {contents}
            </div>
        ); 
    }

    async populateUsers() {
        const response = await fetch('api/user', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'            
            }
        });

        const data = await response.json(); 

        // This code would be removed to take into account the current user returned
        if (data.length > 0) {
            let user = authenticationService.currentUserValue;
            let initialIndex = 0;

            user.gemsToGive = data.find(curUser => curUser.id == user.id).gemsToGive;
            localStorage.setItem('currentUser', JSON.stringify(user));

            this.setState({
                currentUser: user, users: data, loading: false, toUserIndex: initialIndex
            });
        }
    }
}