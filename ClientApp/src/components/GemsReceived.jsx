import React from 'react';
import { authenticationService } from '../_services/authentication.service'; 

export class GemsReceived extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            gems: [],
            message: "",
            loading: true
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

            if (gem.to.id == currentUser.id) {
                let button = <button className="btn btn-squared-default btn-info mb-1 " onClick={this.displayMessage.bind(this,
                    gem.message)}><i class="fas fa-gem fa-4x"></i><br /><br />{gem.from && gem.from.firstName}</button>;
                let button_new = <><button className="btn btn-squared-default btn-info mb-1" onClick={this.displayMessage.bind(this,
                    gem.message)}><i class="fas fa-gem fa-4x"></i><br /><br />{gem.from && gem.from.firstName}</button><br /></>
                i++;
                if (i % 5 === 0)
                    return button_new;
                else
                    return button;
            }
        });

        if (this.state.gems.length > 0)
            content = list;
        else
            content = <em>You have not received any gems yet.</em>;

        return content;
    }

    render() {
        const content = this.state.loading ? <h1><em>Loading...</em></h1> : this.renderGems(this.state.gems);

        return (
            <>
                <center><em><h1>Gems you have received </h1></em></center>
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

        const data = await response.json();

        this.setState({
                gems: data,
                loading: false
        });
    }
}