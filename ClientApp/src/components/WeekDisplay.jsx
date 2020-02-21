import React from 'react'; 
import { Link } from 'react-router-dom'; 
import { getWeekSince } from '../_helpers/week-helper'; 
import { GemWeek } from './GemWeek'; 
import { Route } from 'react-router';

export class WeekDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}; 
    }

    render() {
        const currentWeek = getWeekSince();    
        var list = []; 
        var i; 
        for (i = 1; i <= currentWeek; i++) {
            list.push(
                <li className="nav-item" key={i}>
                    <Link className="nav-link active" to={`${this.props.match.url}/${i}`}><h6>Week {i}</h6></Link>
                </li>
            ); 
        }

        return (
            <>
                <h1> 
                    <ul className="nav nav-tabs">
                        {list}
                    </ul>
                </h1>

                <Route path={`${this.props.match.path}/:week`} component={GemWeek}/>
            </>
        );
    }
}