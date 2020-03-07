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
            loading: true
        };
    }

    componentDidMount() {
        this.populateCards();
    }

    renderCards() {
        let currentUserGuid = "31c2d99f-567f-4024-a997-b5b9ab8ecd54";

        let list = this.state.cards.map((card, index) => {
            if (card.owner.id == currentUserGuid) {
                var cardToReturn; 
                switch (card.cardType) {
                    case 0:
                        cardToReturn = <img src={SelfHug} />
                        break;
                    case 1:
                        cardToReturn = <img src={RobinHood}/>
                        break;
                    case 2:
                        cardToReturn = <img src={StealGem} />
                        break;
                    case 3:
                        cardToReturn = <img src={StealCard} />
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
                {contents}
            </>
        );
    }

    async populateCards() {
        const response = await fetch('api/card', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        this.setState({
            cards: data,
            loading: false
        });
    }
}