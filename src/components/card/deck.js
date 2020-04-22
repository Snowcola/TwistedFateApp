import React, { useEffect, useState } from "react"
import "../../css/index.css"
import Card from "./card"
import Header from "./categoryHeader"


const useLogItemOnChange = item => {
    useEffect(() => {
        console.log(item)
    }, [item])
}


export default function Deck(props) {
    const [decklist, setDecklist] = useState([])
    const [spells, setSpells] = useState([])
    const [champions, setChampions] = useState([])
    const [followers, setFollowers] = useState([])

    useEffect(() => {
        setDecklist(props.decklist.map(card => {
            return (
                <Card {...card} key={card.cardCode} />
            )
        }))

        setSpells(props.decklist
            .filter(card => (card.type === 'Spell'))
            .map(card => {
                return (
                    <Card {...card} key={card.cardCode} />
                )
            }))

        setChampions(props.decklist
            .filter(card => (card.supertype === 'Champion'))
            .map(card => {
                return (
                    <Card {...card} key={card.cardCode} />
                )
            }))

        setFollowers(props.decklist
            .filter(card => (card.type === 'Unit' && card.supertype !== 'Champion'))
            .map(card => {
                return (
                    <Card {...card} key={card.cardCode} />
                )
            }))


    }, [props.decklist])

    useLogItemOnChange(decklist)

    return (
        <div className="deck-container">
            <div>
                <Header title="Champions" />
                {champions.map(card => (
                    card
                ))}
            </ div>
            <div>
                <Header title="Followers" />
                {followers.map(card => (
                    card
                ))}
            </ div>
            <div>
                <Header title="Spells" />
                {spells.map(card => (
                    card
                ))}
            </ div>
        </div>
    )
}