import React, { Component } from 'react';
import SelfHug from '../imgs/selfhug.png'
import RobinHood from '../imgs/robinhood.png';
import StealGem from '../imgs/stealgem.png';
import StealCard from '../imgs/stealcard.png'; 
import Revive from '../imgs/revive.png'; 
import { authenticationService } from '../_services/authentication.service';
import { authHeader } from '../_helpers';

export class CardPage extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            cards: [],
            users: [],
            loading: true,
            selfhug: false,
            robinhood: false, 
            stealgem: false,
            stealcard: false,
            formControls: {
                shGems: {
                    value: 0
                },
                rhSource: {
                    value: 0
                },
                rhTarget: {
                    value: 0
                },
                sgTarget: {
                    value: 0
                },
                scTarget: {
                    value: 0
                },
                scType: {
                    value: 0
                }
                /* Add your form control change variables here */
            }
        };

        this.toggleSelfHug = this.toggleSelfHug.bind(this); 
        this.toggleRobinHood = this.toggleRobinHood.bind(this);
        this.toggleStealGem = this.toggleStealGem.bind(this);
        this.toggleStealCard = this.toggleStealCard.bind(this);

        /* Bind your handler */ 

        this.changeHandler = this.changeHandler.bind(this); 
    }

    componentDidMount() {
        this.populateCards();
    }

    /* These toggle visibility of specific card form elements, add your own*/
    toggleSelfHug() {
        this.setState({
            selfhug: true,
            robinhood: false,
            stealgem: false,
            stealcard: false
        })
    }

    toggleRobinHood() {
        this.setState({
            selfhug: false,
            robinhood: true,
            stealgem: false,
            stealcard: false
        })
    }

    toggleStealGem() {
        this.setState({
            selfhug: false,
            robinhood: false,
            stealgem: true,
            stealcard: false
        })
    }

    toggleStealCard() {
        this.setState({
            selfhug: false,
            robinhood: false,
            stealgem: false,
            stealcard: true
        })
    }

    changeHandler(e) {
        const name = e.target.name;
        const value = e.target.value; 

        this.setState({
            formControls: {
                ...this.state.formControls,
                [name]: {
                    ...this.state.formControls[name],
                    value
                }
            }
        });
    }

    /* Call your backend here */
    async reviveHandler() {
        await fetch('api/card/revive', {
            method: 'GET',
            headers: {
                ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                ...authHeader()
            }
        }).then(
            window.location.reload()
        );
    }

    async selfHugHandler() {
        let gems = this.state.formControls.shGems.value; 
        await fetch('api/card/self_hug/' + gems, {
            method: 'GET',
            headers: {
                ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                ...authHeader()
            }
        });
    }

    async robinHoodHandler() {
        let sourceIndex = this.state.formControls.rhSource.value;
        let targetIndex = this.state.formControls.rhTarget.value;
        let source = this.state.users[sourceIndex]; 
        let target = this.state.users[targetIndex]; 
        await fetch('api/card/robin_hood/' + source.id + '/' + target.id, {
            method: 'GET',
            headers: {
                ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                ...authHeader()
            }
        });
    }

    async stealGemHandler() {
        let targetIndex = this.state.formControls.sgTarget.value;
        let target = this.state.users[targetIndex];
        await fetch('api/card/steal_gem/' + target.id, {
            method: 'GET',
            headers: {
                ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                ...authHeader()
            }
        });
    }

    async stealCardHandler() {
        let targetIndex = this.state.formControls.scTarget.value;
        let target = this.state.users[targetIndex];
        let cardType = this.state.formControls.scType.value; 

        await fetch('api/card/steal_card/' + target.id + '/' + cardType, {
            method: 'GET',
            headers: { 
                ...{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                ...authHeader()
            }
        });
    }
    
    renderCards() {
        let currentUserGuid = this.state.currentUser.id;

        let list = this.state.cards.map((card, index) => {
            if (card.owner.id == currentUserGuid) {
                var cardToReturn; 
                switch (card.cardType) {
                    case 0:
                        cardToReturn = <button key={index} onClick={this.toggleSelfHug}><img src={SelfHug} /></button>
                        break;
                    case 1:
                        cardToReturn = <button key={index} onClick={this.toggleRobinHood}><img src={RobinHood} /></button>
                        break;
                    case 2:
                        cardToReturn = <button key={index} onClick={this.toggleStealGem}><img src={StealGem} /></button>
                        break;
                    case 3:
                        cardToReturn = <button key={index} onClick={this.toggleStealCard}><img src={StealCard} /></button>
                        break;
                    case 6:
                        cardToReturn = <button key={index} onClick={this.reviveHandler.bind(this)}><img src={Revive} /></button>
                        break;
                    default:
                        break;
                    /* Add your images here */ 
                }

                return cardToReturn; 
            }              
        });

        return list; 
    }

    render() {
        let contents = this.state.loading 
            ? <p><em>Loading...</em></p> : this.renderCards();

        let currentUserGuid = authenticationService.currentUserValue.id; 

        let dropdownList = this.state.users.map((user, index) => {
            if (user.id != currentUserGuid)
                return <option key={index} value={index}>{user.firstName}</option>
        });

        const cardNames = ["Self Hug", "Robin Hood", "Steal Gem", "Steal Card", "Revive", "Double Receive", "Double Give", "Malediction"]; 
        let cardDropdownList = cardNames.map((card, index) => {
            return <option key={index} value={index}>{card}</option>
        });

        /* Render your cards and forms here */
        return (
            <>
                <div className="centered">
                    {contents}       
                </div>
                <br/><br/>
                {this.state.selfhug &&
                    <>
                        <div class="centered">
                        <form class="form-inline">
                        <label class="mr-sm-2" for="selfHugInputGems"><strong>Gems to give yourself:</strong></label>
                            <input type="number" id="selfHugInputGems" placeholder={0}
                                name="shGems" value={this.state.formControls.shGems.value} onChange={this.changeHandler}/>
                            <button type="submit" class="btn btn-primary mb-2" onClick={this.selfHugHandler.bind(this)}>Submit</button>
                        </form>
                        </div>
                    </>
                }
                {this.state.robinhood && 
                    <div class="centered">
                        <form class="form-inline">
                            <label class="mr-sm-2" for="stealFromInput"><strong>Steal gem from:</strong></label>
                            <select className="form-control mr-sm-2" id="stealFromInput"
                                name="rhSource" value={this.state.formControls.rhSource.value} onChange={this.changeHandler}>
                                {dropdownList}
                            </select>  
                            <label class="mr-sm-2" for="giveToInput"><strong>Give gem to:</strong></label>
                            <select className="form-control mr-sm-2" id="giveToInput"
                                name="rhTarget" value={this.state.formControls.rhTarget.value} onChange={this.changeHandler}>>
                                {dropdownList}
                            </select> 
                            <button type="submit" class="btn btn-primary mb-2" onClick={this.robinHoodHandler.bind(this)}>Submit</button>
                        </form>
                    </div>
                }
                {this.state.stealgem && 
                    <div class="centered">
                        <form class="form-inline">
                            <label class="mr-sm-2" for="stealGemInput"><strong>Steal gem from:</strong></label>
                            <select className="form-control mr-sm-2" id="stealGemInput"
                                name="sgTarget" value={this.state.formControls.sgTarget.value} onChange={this.changeHandler}>
                                {dropdownList}
                            </select> 
                            <button type="submit" class="btn btn-primary mb-2" onClick={this.stealGemHandler.bind(this)}>Submit</button>
                        </form>
                    </div>}

                {this.state.stealcard && 
                    <div class="centered">
                        <form class="form-inline">
                            <label class="mr-sm-2" for="stealCardInput"><strong>Steal card from:</strong></label>
                            <select className="form-control mr-sm-2" id="stealCardInput"
                                name="scTarget" value={this.state.formControls.scTarget.value} onChange={this.changeHandler}>
                                {dropdownList}
                            </select> 
                            <label class="mr-sm-2" for="stealCardType"><strong>Select your card:</strong></label>
                            <select className="form-control mr-sm-2" id="stealCardType"
                                name="scType" value={this.state.formControls.scType.value} onChange={this.changeHandler}>
                                {cardDropdownList}
                            </select> 
                            <button type="submit" class="btn btn-primary mb-2" onClick={this.stealCardHandler.bind(this)}>Submit</button>
                        </form>
                    </div>
                }
            </>
        );
    }

    async populateCards() {
        const cardResponse = await fetch('api/card', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const cardData = await cardResponse.json();

        const userResponse = await fetch('api/user', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const userData = await userResponse.json();

        let user = authenticationService.currentUserValue; 
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.setState({
            currentUser: user,
            cards: cardData,
            users: userData,
            loading: false
        });
    }
}