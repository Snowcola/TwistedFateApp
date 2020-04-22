import React, { useState, useEffect } from "react";
import moment from "moment";
import { render } from "react-dom";
import { Card, Accordion, Button, Col, Image } from "react-bootstrap";
import { Icon } from "antd";
import Row from "../layout/Row";
import cardList from "../../static/data/set1-en_us.json";
import LoRCard from "../card/card";
import Deck from "../card/deck";

const customPanelStyle = {
  overflow: "hidden",
  color: "lightgrey",
  bottomMargin: "5px",
  borderLeft: "none",
  borderRight: "none"
};

const champIcon = (
  <svg height="24" width="24" viewBox="0 0 24 24">
    <path
      d="M17.59 7.154L20.186 2s.875 1.303 1.24 3.37l.04.242-1.28 1.74H21.6c0 .35-.038.702-.085 1.053l-.05.35-1.954 2.61h1.28a18.205 18.205 0 01-2.425 4.147l.066-.089-.004.265c-.182 4.989-4.726 6.262-4.908 6.31l-.005.002.606-3.946h1.348v-3.345l1.347-1.338V9.358l-3.705 2.675v3.479h-2.022v-3.479L7.384 9.358v4.013L8.73 14.71v3.345h1.415L10.82 22s-4.857-1.222-5.048-6.312l-.004-.196-.001.02c-1.05-1.288-1.817-2.576-2.3-3.812l-.126-.335H4.69l-2.022-2.61C2.6 8.222 2.6 7.82 2.6 7.352h1.482L2.735 5.612C3.072 3.405 4.015 2 4.015 2l2.594 5.154a6.33 6.33 0 015.258-3.143l.233-.004.233.004a6.33 6.33 0 015.258 3.143L20.185 2z"
      fill="lightgrey"
      fill-rule="nonzero"
    ></path>
  </svg>
);
const followerIcon = (
  <svg height="24" width="24" viewBox="0 0 24 24">
    <path
      d="M19.218 3.429L12.167 2 5.115 3.429S6.878 10.07 3 17.07L10.051 22l.635-10s-4.02 2.286-3.455-4.286l4.936-1.428 4.936 1.428c.564 6.5-3.456 4.286-3.456 4.286l.635 10 7.051-4.929c-3.807-7-2.115-13.642-2.115-13.642z"
      fill="lightgrey"
      fill-rule="nonzero"
    ></path>
  </svg>
);
const spellIcon = (
  <svg height="24" width="24" viewBox="0 0 24 24">
    <path
      d="M4.52 15.714s-.637-4.072 5.171-9.071c.284.357.638.714.992.928.991-.571 1.629-1.643 1.629-2.785 0-1.215-.638-2.215-1.63-2.786 2.126 0 5.596 3.143 5.596 8.142v.643c-.495-.357-1.204-.571-1.841-.571-1.558 0-2.975.857-3.683 2.143.779 1.285 2.125 2.142 3.683 2.142 1.558 0 3.116-1.071 3.754-2.5a5.85 5.85 0 011.204 2.5s.992 4.429-3.117 6.5c-4.108 2.071-8.074.286-8.074.286s3.895.071 4.958-3c0-.072-4.746.643-8.641-2.571z"
      fill="lightgrey"
      fill-rule="nonzero"
    ></path>
  </svg>
);

function card_data(card) {
  const x = cardList.filter(item => item.cardCode == card.card);
  const result = Object.assign({}, x[0], { count: card.count });
  return result;
}

card_data("01FR007");

function region_image(name) {
  let icon_name = "";
  switch (name) {
    case "Piltover & Zaun":
      icon_name = "piltoverzuan";
      break;
    case "Ionia":
      icon_name = "ionia";
      break;
    case "Noxus":
      icon_name = "noxus";
      break;
    case "Demacia":
      icon_name = "demacia";
      break;
    case "Shadow Isles":
      icon_name = "shadowisles";
      break;
    case "Freljord":
      icon_name = "freljord";
      break;
    default:
      icon_name = "all";
      break;
  }
  return require(`../../static/img/regions/icon-${icon_name}.png`);
}

/*"rgba(97, 152, 164, 0.5)" "rgba(201, 103, 143, 0.5)" "#6DD6BD"*/

const image_uri = "http://ddragon.leagueoflegends.com/cdn/9.3.1/img/champion/";

const pic =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16e8f573c04%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16e8f573c04%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22108.5390625%22%20y%3D%2297.5%22%3E286x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
export default function GameResult({ result }) {
  const [open, setOpen] = useState(false);
  const [playerDeck, setPlayerDeck] = useState([]);
  const [playerDeckSummary, setPlayerDeckSummary] = useState([]);
  const [oppoDeckSummary, setOppoDeckSummary] = useState([]);
  const [oppoDeck, setOppoDeck] = useState([]);
  const size = 32;

  useEffect(() => {
    if (result.player_deck.deck_list) {
      const deck = result.player_decklist.map(card => {
        return card_data(card);
      });
      setPlayerDeck(deck);
      const spells = deck
        .filter(card => card.type === "Spell")
        .map(card => card).length;
      const champs = deck
        .filter(card => card.supertype === "Champion")
        .map(card => card).length;
      const followers = deck
        .filter(card => card.type === "Unit" && card.supertype !== "Champion")
        .map(card => card).length;
      setPlayerDeckSummary(
        Object.assign(
          {},
          { spells: spells, champions: champs, followers: followers }
        )
      );
    }
    if (result.opponent_decklist) {
      const deck = result.opponent_decklist.map(card => {
        return card_data(card);
      });
      setOppoDeck(deck);
      const spells = deck
        .filter(card => card.type === "Spell")
        .map(card => card).length;
      const champs = deck
        .filter(card => card.supertype === "Champion")
        .map(card => card).length;
      const followers = deck
        .filter(card => card.type === "Unit" && card.supertype !== "Champion")
        .map(card => card).length;
      setOppoDeckSummary(
        Object.assign(
          {},
          { spells: spells, champions: champs, followers: followers }
        )
      );
    }
  }, []);

  const clickHandler = () => {
    setOpen(!open);
  };

  return (
    <Card
      style={{
        backgroundColor: `${result.win ? "#73BCDD" : "#F97C8B"}`,
        ...customPanelStyle
      }}
    >
      <Accordion.Toggle
        as={Card.Header}
        eventKey={result.id}
        onClick={clickHandler}
      >
        <Row>
          <div
            style={{
              borderBottom: `1px solid ${result.win ? "#A2E4D5" : "#FA93A0"}`,
              width: "95%",
              marginBottom: "10px"
            }}
          >
            <Row
              align="space-between"
              style={{ alignContent: "space-between", padding: "10px" }}
            >
              {" "}
              <div className="timestamp">
                {moment.utc(result.timestamp).fromNow()}
              </div>
              <Icon type="caret-right" rotate={open ? 90 : 0} />
            </Row>
          </div>
        </Row>
        <Row>
          <Col>
            <Row>
              <div>
                {result.player_deck.champions.map(champ => (
                  <Image
                    src={`${image_uri}${champ}.png`}
                    rounded
                    style={{ width: `${size}px`, height: `${size}px` }}
                  />
                ))}
              </div>
            </Row>
            <Row>
              <div>
                {result.player_deck.regions.map(reg => {
                  const region = region_image(reg);
                  return (
                    <Image
                      src={region}
                      style={{ width: `${size}px`, height: `${size}px` }}
                    />
                  );
                })}
              </div>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col xs={3}></Col>
              <Col xs={2}>{champIcon}</Col>{" "}
              <Col xs={6}>{playerDeckSummary.champions}</Col>
            </Row>
            <Row>
              <Col xs={3}></Col>
              <Col xs={2}>{followerIcon}</Col>{" "}
              <Col xs={6}>{playerDeckSummary.followers}</Col>
            </Row>
            <Row>
              <Col xs={3}></Col>
              <Col xs={2}>{spellIcon}</Col>{" "}
              <Col xs={6}>{playerDeckSummary.spells}</Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <p className="result-text">{result.win ? "Victory" : "Defeat"}</p>
            </Row>
            <Row>
              <p className="vs">VS</p>
            </Row>
            <Row>
              <p className="result-text">{result.opponent}</p>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col xs={3}></Col>
              <Col xs={2}>{champIcon}</Col>{" "}
              <Col xs={6}>{oppoDeckSummary.champions}</Col>
            </Row>
            <Row>
              <Col xs={3}></Col>
              <Col xs={2}>{followerIcon}</Col>{" "}
              <Col xs={6}>{oppoDeckSummary.followers}</Col>
            </Row>
            <Row>
              <Col xs={3}></Col>
              <Col xs={2}>{spellIcon}</Col>{" "}
              <Col xs={6}>{oppoDeckSummary.spells}</Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <p>
                {result.opponent_champions.map(champ => (
                  <Image
                    src={`${image_uri}${champ}.png`}
                    rounded
                    style={{ width: `${size}px`, height: `${size}px` }}
                  />
                ))}
              </p>
            </Row>
            <Row>
              <p>
                {result.opponent_regions.map(reg => {
                  const region = region_image(reg);
                  return (
                    <Image
                      src={region}
                      alt={reg}
                      style={{ width: `${size}px`, height: `${size}px` }}
                    />
                  );
                })}
              </p>
            </Row>
          </Col>
        </Row>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={result.id}>
        <Card.Body>
          <Row>
            <Col>
              <Deck decklist={playerDeck} />
            </Col>
            <Col>
              <Deck decklist={oppoDeck} />
            </Col>
          </Row>
        </Card.Body>
      </Accordion.Collapse>
      <div style={{ backgroundColor: "rgb(45, 44, 53)", height: "5px" }}></div>
    </Card>
  );
}
