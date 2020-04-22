import React, { useContext } from "react"
import { CardContext } from "../contextProviders/cardContext"
import "../../css/index.css"


export default function CardDetails(card) {
    const [state, setState] = useContext(CardContext)
    if (state.cardCode) {
        const cardImg = require(`../../static/img/cards/${state.cardCode}.png`)
        return (
            <div>
                <h1>Card Details</h1>
                <img src={cardImg} height={500}></img>

            </div>
        )
    }
    return (
        <div><h1>Card Details</h1></div>
    )
}