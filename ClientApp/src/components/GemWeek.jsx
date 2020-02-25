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
        var content;

        var i;
        var list = [];
        var gems = this.state.gems; 
        for (i = 0; i < this.state.gems.length; i++) {
            if (gems[i].week == this.props.match.params.week) {
                let card = <div key={gems[i].id} className="card" style={{ marginTop: 2 + 'em' }} >
                               <div className="card-header">
                                    {gems[i].from.name} sent a gem to {gems[i].to.name}
                               </div>

                               <div className="card-body">
                                    <b>{gems[i].message}</b>
                               </div>
                           </div>

                list.push(card); 
            }
        }

        if (list.length > 0)
            content = list; 
        else 
            content = <em>There are no gems that have been transferred yet this week.</em>

        return content; 
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

        this.setState({
            gems: data,
            loading: false
        }); 
        
    }
}