import React from 'react'; 

export class GemWeek extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gems: [], 
            loading: true
        }
    }

    componentDidMount() {
        this.populateRocks();
    }

    renderGems() {
        var list = this.state.gems.map(gem => {
            if (gem.week == this.props.match.params.week) {
                let card = <div key={gem.id} className="card" style={{ marginTop: 2 + 'em' }} >
                    <div className="card-header">
                        {gem.from.firstName} {gem.from.lastName} sent a gem to {gem.to.firstName} {gem.to.lastName}
                    </div>

                    <div className="card-body">
                        <b>{gem.message}</b>
                    </div>
                </div>

                return card;
            }
        });

        return list; 
    }

    render() {
        const gemList = this.renderGems(); 
        const gems = this.state.loading ? <h6><em>Loading Gems for the Week...</em></h6> : gemList;

        return (
            <>
                <h3><em>Week {this.props.match.params.week} Report</em></h3>
                {gems}
            </>
        );
    }

    async populateRocks() {
        const response = await fetch('api/gem/', {
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
            })
        }
    }
}