import React, { useState, useEffect, useContext } from "react";
import "../../css/index.css";
import { CardContext } from "../contextProviders/cardContext";

export default function Card(card) {
  console.log(card.cardCode);
  const [cardDetails, setCardDetails] = useContext(CardContext);
  const [cardCode, setCardCode] = useState(card.cardCode);
  const [name, setName] = useState(card.name);
  const [cost, setCost] = useState(card.cost);
  const [type, setType] = useState(card.type);
  const [count, setCount] = useState(card.count);
  const [bgPic, setBgPic] = useState();

  useEffect(() => {
    console.log("card");
    console.log(card);
    setCardCode(card.cardCode);
    setName(card.name);
    setCost(card.cost);
    setType(card.type);
    //setBgPic(require(`../../static/img/decklist_thumbnails/set1/${cardCode}-deck-tnail.png`))
  }, [card]);

  const bgpic = require(`../../static/img/decklist_thumbnails/set1/${cardCode}-deck-tnail.png`);
  //console.log(card.cardCode)
  const bgstyle = {
    background: `linear-gradient(90deg, rgb(90, 184, 218) 5%, rgba(90, 184, 218, 1) 13%, rgba(90, 184, 218, .2) 13%), url(${bgpic}) right center no-repeat`,
    backgroundSize: "100%"
    //    background: `url(${bgpic})`
  };

  function onClick(e) {
    e.preventDefault();
    const newCount = count - 1;
    if (newCount >= 0) {
      setCount(newCount);
    }
  }

  function hoverAction(e) {
    setCardDetails(card);
  }

  return (
    <div onClick={onClick} onMouseEnter={hoverAction}>
      <a href="#">
        <div className={`card-card ${type.toLowerCase()}`} style={bgstyle}>
          <div className="cost-wrapper cost-container">
            <p className="cost-text">{cost}</p>
          </div>
          <p className="card-name-text">{name}</p>
          <div className="card-title"></div>
          <div className="card-count-containers">
            <div className="card-count-inner-containers">
              <p className="card-count-amount">
                {/*<span className="card-count-text-x">x</span>
                {count}*/}
              </p>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
