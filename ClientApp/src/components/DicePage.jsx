import React from 'react';
import ReactDice from 'react-dice-complete';
import 'react-dice-complete/dist/react-dice-complete.css';
import SelfHug from '../imgs/selfhug.png'
import RobinHood from '../imgs/robinhood.png';
import StealGem from '../imgs/stealgem.png';
import StealCard from '../imgs/stealcard.png'; 
import DoubleReceive from '../imgs/doubleReceive.png'; 
import DoubleSend from '../imgs/doubleSend.png'; 
import Revive from '../imgs/revive.png'; 
import Malediction from '../imgs/malediction.png'; 
import { getWeekSince } from '../_helpers/week-helper';

export class DicePage extends React.Component {
    userIndex = 0; 

    constructor(props) {
        super(props);
        this.state = {
            users: [], 
            loading: true, 
            cardNumber: 0,
            userIndex: 0,
            diceRoll: 0,
            lostGems: 0,
            canPlay: false
        };

        this.rollDoneCallback = this.rollDoneCallback.bind(this);
    }

    componentDidMount() {
        this.populateUsers();
    }

    userSelectChangeHandler(e) {
        let userSelect = e.target.value; 
        console.log(userSelect); 
        this.userIndex = userSelect; 
    }

    renderCard() {
        let cardNumber = this.state.cardNumber;

        var card; 

        switch (cardNumber) {
            case 1:
                card = <img src={SelfHug}/>
                break;
            case 2:
                card = <img src={RobinHood}/>
                break;
            case 3:
                card = <img src={StealGem} />
                break;
            case 4:
                card = <img src={StealCard} />
                break;
            case 5:
                card = <img src={DoubleReceive} />
                break;
            case 6:
                card = <img src={DoubleSend} />
                break;
            case 7:
                card = <img src={Revive} />
                break;
            case 8:
                card = <img src={Malediction} />
                break;
            default: 
                card = <></>
        }
        let index = this.state.userIndex; 
        let user = this.state.users[index]; 

        var gemsLost; 

        let diceRoll = this.state.diceRoll; 

        switch (diceRoll) {
            case 1:
            case 2:
                gemsLost = 0;
                break;
            case 3:
            case 4:
                gemsLost = 1;
                break;
            case 5: 
            case 6:
                gemsLost = 4;
                break;
            default:
                gemsLost = 0; 
        }

        var display; 

        if (user && cardNumber > 0) {
            if (gemsLost === 0)
                card = <><h1>{user.firstName} got:</h1><br />{card}</>
            else if (gemsLost === 1)
                card = <><h1>{user.firstName} lost a gem and got:</h1><br />{card}</>
            else if (gemsLost > 1)
                card = <><h1>{user.firstName}  lost {gemsLost} gems and got:</h1><br />{card}</>

            display = this.state.canPlay ? card: <strong>{user.firstName} does not have enough gems to gamble.</strong>
        }

        return display; 
    }

    render() {
        let list = this.state.users.map((user, index) => {
            if (user.role === "User" && user.name !== "Graveyard") {
                return <option key={index} value={index}>{user.name}</option>
            }
        }); 

        let select = <div>
            <form class="form-inline">
            <label className="mr-sm-2" htmlFor="toUser">Roll the dice for: </label>
                <select className="form-control mr-sm-2" id="toUser" onChange={this.userSelectChangeHandler.bind(this)}>
                {list}
            </select>
            </form>
            </div>

        let content = this.state.loading ? <p><em>Loading...</em></p> : select

        let cardToRender = this.renderCard(); 

        return (
            <>
                <center><h5>Test your luck!</h5> </center>
                <div class="container mt-5">
                    <div class="row">
                        <div class="col">
                                {content}
                        </div>
                        <div class="col">
                    <ReactDice
                        numDice={1}
                        rollDone={this.rollDoneCallback}
                        ref={dice => this.reactDice = dice}
                        faceColor={"#8D021F"}
                        dotColor={"#FFFFFF"}
                        dieSize={200}
                            />
                        </div>
                    </div>
                    <div class="row mt-5">
                        <div class="col">
                            <center>
                                {cardToRender}
                            </center>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    rollAll() {
        this.reactDice.rollAll()
    }

    rollDoneCallback(num) {
        console.log(`You rolled a ${num}`);

        let random = Math.round(Math.random() * 7 + 1)
        console.log(random); 

        this.gamble(random, num);
    }

    async gamble(random, num) {
        let index = this.userIndex; 
        let user = this.state.users[index]; 
        let card = random;
        if (card > 0)
            card = card - 1; 
        let roll = num; 

        var gemsLost; 

        switch (roll) {
            case 1:
            case 2:
                gemsLost = 0;
                break;
            case 3:
            case 4:
                gemsLost = 1;
                break;
            case 5:
            case 6:
                gemsLost = 4;
                break;
            default:
                gemsLost = 0;
        }

        await fetch('api/user/gamble/' + user.id + '/' + card + '/' + getWeekSince() + '/' + gemsLost, {
            method: 'GET',
            headers: {
                ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        }).then(data => data.json())
            .then(bool => {
                this.setState({
                    cardNumber: random,
                    diceRoll: num,
                    canPlay: bool,
                    userIndex: this.userIndex
                });
            });
    }

    async populateUsers() {
        const response = await fetch('api/user', {
            method: 'GET',
            headers: {
                ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        });

        const data = await response.json();

        this.setState({
            users: data, loading: false
        });
    }
}