import React, { useEffect, useState } from "react"
import eel from './../../App'

import Deck from "../../components/card/deck"
import CardDetails from "../../components/card/cardDetails"
import { CardContextProvider } from "../../components/contextProviders/cardContext"

export default function DeckView(props) {
    const [decklist, setDecklist] = useState([])

    const getDeck = () => {
        window.eel.get_decklist("CEBAGAIDCQRSOCQBAQAQYDISDQTCOKBNGQAACAIBAMFQ")((decklist) => {
            const deck_obj = JSON.parse(decklist)
            console.log(deck_obj)
            setDecklist(deck_obj)

        })
    }

    const getCurrentDeck = () => {
        window.eel.get_current_decklist()((decklist) => {
            const deck_obj = JSON.parse(decklist)
            setDecklist(deck_obj)
        })
    }

    useEffect(() => {
        getDeck()
        console.log("running")
    }, [])

    return (
        <CardContextProvider>
            <div className="App">
                <div className="deck-container">
                </div>
                <Deck decklist={decklist} />
                <hr></hr>
                <CardDetails />
            </div>
        </CardContextProvider>
    )
}
