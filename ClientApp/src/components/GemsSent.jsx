import React from 'react';
import { authenticationService } from '../_services/authentication.service'; 

export class GemsSent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gems: [],
            loading: true
        };
    }

    componentDidMount() {
        this.populateRocks();
    }

    renderGems() {
        let currentUser = authenticationService.currentUserValue;

        var content; 
        var list = this.state.gems.map(gem => {
            if (gem.from.id == currentUser.id) {
                let card = <div key={gem.id} className="card" style={{ marginTop: 2 + 'em' }} >
                    <div className="card-header">
                        You sent a gem to {gem.to.name}!
                    </div>

                    <div className="card-body">
                        <b>Your message:</b> {gem.message}
                    </div>
                </div>

                return card;
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
                <h5> Gems you have sent: </h5>
                {content}
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