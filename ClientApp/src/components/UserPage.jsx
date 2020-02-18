import React from 'react'; 
import { v4 as uuidv4 } from 'uuid'; 
import { authenticationService } from '../_services/authentication.service'; 
import { getWeekSince } from '../_helpers/week-helper';

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
        alert('Submitted rock to ' + this.state.users[this.state.toUserIndex].firstName)
        let currentUser = this.state.currentUser;
        if (currentUser.gemsToGive > 0)
            currentUser.gemsToGive -= 1; 

        this.setState({
            currentUser: currentUser
        })

        let toUser = this.state.users[this.state.toUserIndex]; 
        let guid = uuidv4(); 
        console.log(uuidv4());
        console.log(currentUser.id); 
        console.log(toUser.id); 
       fetch('api/gem', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
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
            })
        });
    }

    renderUserPage(users) {
        let currentUser = this.state.currentUser; 
 
        let list = users.map((user,index) => {
            if (user.id != currentUser.id) {
                return <option key={index} value={index}>{user.firstName}</option>
            }
        });

        var i;
        let toUserIndex = this.state.toUserIndex; 

        return (
            <>
                <h1> Hi {currentUser.firstName}! </h1>
                <h1> You currently have {currentUser.gemsToGive} gems to give this week.</h1> 

                <label className="mr-sm-2" htmlFor="toUser">Give a gem to: </label>
                <select className="form-control mr-sm-2" id="toUser" onChange={this.toUserChangeHandler.bind(this)}>
                    {list}
                </select>  

                <div className="form-group">
                    <label htmlFor="reasonTextArea">Why are you giving this gem to {this.state.users[toUserIndex].firstName} ?</label>
                    <textarea className="form-control" id="reasonTextArea" rows="3" onChange={this.textMessageChangeHandler.bind(this)}></textarea>
                </div>     

                <button type="button" className="btn btn-outline-dark" onClick={this.submitChoice.bind(this)}>Submit this gem</button>
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
            let initialIndex = user.Id == data[0].Id ? 0 : 1;

            this.setState({
                currentUser: user, users: data, loading: false, toUserIndex: initialIndex
            });
        }
    }
}