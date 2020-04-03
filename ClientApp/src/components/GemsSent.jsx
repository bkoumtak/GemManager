import React from 'react';
import { authenticationService } from '../_services/authentication.service'; 

export class GemsSent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gems: [],
            loading: true,
            message: ""
        };
    }

    componentDidMount() {
        this.populateRocks();
    }

    displayMessage(gemMessage) {
        this.setState({
            message: gemMessage
        });
    }

    sortGemsWeek(a, b) {
        if (a.week > b.week) return 1;
        if (a.week < b.week) return -1;
        return 0;
    }

    renderGems() {
        let currentUser = authenticationService.currentUserValue;

        var content; 
        var i = 0; 

        var sortedGems = this.state.gems.sort(this.sortGemsWeek); 

        var list = sortedGems.map(gem => {
            if (gem.from) {
                if (gem.from.id == currentUser.id) {
                    let button =
                        <button className="btn btn-squared-default btn-danger mb-1 " onClick={this.displayMessage.bind(
                            this,
                            gem.message)}><i class="fas fa-gem fa-4x"></i><br/><br/>{gem.to.firstName}</button>;
                    let button_new =
                        <><button className="btn btn-squared-default btn-danger mb-1" onClick={this.displayMessage.bind(
                            this,
                            gem.message)}><i class="fas fa-gem fa-4x"></i><br/><br/>{gem.to.firstName
                            }</button><br/></>
                    i++;
                    if (i % 5 === 0)
                        return button_new
                    else
                        return button;
                }
            }
        });

        if (this.state.gems.length > 0)
            var content = list;
        else
            var content = <em>You currently have not sent any gems.</em>;

        return content;
    }

    render() {
        const content = this.state.loading ? <h1><em>Loading...</em></h1> : this.renderGems(this.state.gems);

        return (
            <>
                <center><em><h1>Gems you have sent: </h1></em></center>
                <div class="container">
                    <div class="row">
                        <div class="col">
                            {content}
                        </div>
                        <div class="col">
                            <u><h3>Message:</h3></u> <h4><em>{this.state.message}</em></h4>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    async populateRocks() {
        const response = await fetch('api/gem', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        console.log(response);

        const data = await response.json();
        this.setState({
            gems: data,
            loading: false
        });
    }
}