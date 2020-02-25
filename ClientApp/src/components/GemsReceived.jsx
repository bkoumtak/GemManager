import React from 'react';
import { authenticationService } from '../_services/authentication.service'; 

export class GemsReceived extends React.Component {
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

    renderRocks() {
        let currentUser = authenticationService.currentUserValue;

        var content; 

        var list = this.state.gems.map(gem => {
            if (gem.to.id == currentUser.id) {
                let card = <div key={gem.id} className="card" style={{ marginTop: 2 + 'em' }} >
                    <div className="card-header">
                        You got a gem from {gem.from.firstName} {gem.from.lastName} !
                    </div>
             
                    <div className="card-body">
                        <b>Their message:</b> {gem.message}
                    </div>
                </div>

                return card;
            }
        });

        if (this.state.gems.length > 0)
            content = list;
        else
            content = <em>You have not received any gems yet.</em>;

        return content;
    }

    render() {
        const content = this.state.loading ? <h1><em>Loading...</em></h1> : this.renderRocks(this.state.gems);

        return (
            <>
                <h5> Gems you have received: </h5>
                { content }
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