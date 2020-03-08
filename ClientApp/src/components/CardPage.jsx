import React, { Component } from 'react';
import SelfHug from '../imgs/selfhug.png'
import RobinHood from '../imgs/robinhood.png';
import StealGem from '../imgs/stealgem.png';
import StealCard from '../imgs/stealcard.png'; 

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
            stealcard: false
        };

        this.toggleSelfHug = this.toggleSelfHug.bind(this); 
        this.toggleRobinHood = this.toggleRobinHood.bind(this);
        this.toggleStealGem = this.toggleStealGem.bind(this);
        this.toggleStealCard = this.toggleStealCard.bind(this);
    }

    componentDidMount() {
        this.populateCards();
    }

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


    renderCards() {
        let currentUserGuid = "31c2d99f-567f-4024-a997-b5b9ab8ecd54";

        let list = this.state.cards.map((card, index) => {
            if (card.owner.id == currentUserGuid) {
                var cardToReturn; 
                switch (card.cardType) {
                    case 0:
                        cardToReturn = <button onClick={this.toggleSelfHug}><img src={SelfHug} /></button>
                        break;
                    case 1:
                        cardToReturn = <button onClick={this.toggleRobinHood}><img src={RobinHood} /></button>
                        break;
                    case 2:
                        cardToReturn = <button onClick={this.toggleStealGem}><img src={StealGem} /></button>
                    break;
                    case 3:
                        cardToReturn = <button onClick={this.toggleStealCard}><img src={StealCard} /></button>
                    break;
                }

                return cardToReturn; 
            }              
        });

        return list; 
    }

    render() {
        let contents = this.state.loading 
            ? <p><em>Loading...</em></p> : this.renderCards(); 

        return (
            <>
                <div class="centered">
                    {contents}       
                </div>
                <br/><br/>
                {this.state.selfhug &&
                    <>
                        <div class="centered">
                        <form class="form-inline">
                        <label class="mr-sm-2" for="selfHugInputGems"><strong>Gems to give yourself:</strong></label>
                        <input type="number" id="selfHugInputGems" placeholder={0}/>
                        <button type="submit" class="btn btn-primary mb-2">Submit</button>
                        </form>
                        </div>
                    </>
                }
                {this.state.robinhood && 
                    <div class="centered">
                        <form class="form-inline">
                            <label class="mr-sm-2" for="stealFromInput"><strong>Steal gem from:</strong></label>
                            <input class="mr-sm-2" type="string" id="stealFromInput" />
                            <label class="mr-sm-2" for="giveToInput"><strong>Give gem to:</strong></label>
                            <input type="string" id="giveToInput" />
                            <button type="submit" class="btn btn-primary mb-2">Submit</button>
                        </form>
                    </div>
                }
                {this.state.stealgem && 
                    <div class="centered">
                        <form class="form-inline">
                            <label class="mr-sm-2" for="stealGemInput"><strong>Steal gem from:</strong></label>
                            <input type="string" id="stealGemInput" />
                            <button type="submit" class="btn btn-primary mb-2">Submit</button>
                        </form>
                    </div>}
                {this.state.stealcard && 
                    <div class="centered">
                        <form class="form-inline">
                            <label class="mr-sm-2" for="stealCardInput"><strong>Steal card from:</strong></label>
                            <input type="string" id="stealCardInput" />
                            <button type="submit" class="btn btn-primary mb-2">Submit</button>
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

        
        this.setState({
            cards: cardData,
            users: userData,
            loading: false
        });
    }
}