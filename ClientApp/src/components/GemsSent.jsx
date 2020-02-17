import React from 'react';

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
        var list = this.state.gems.map(gem => {
            if (gem.from.id == "13e9a6d2-61f6-4071-804e-f25923e49c79") {
                let card = <div key={gem.id} className="card" style={{ marginTop: 2 + 'em' }} >
                    <div className="card-header">
                        You sent a gem to {gem.to.firstName} {gem.to.lastName} !
                    </div>

                    <div className="card-body">
                        <b>Your message:</b> {gem.message}
                    </div>
                </div>

                return card;
            }
        });

        return list;
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
        if (data.length > 0) {
            this.setState({
                gems: data,
                loading: false
            })
        }
    }
}