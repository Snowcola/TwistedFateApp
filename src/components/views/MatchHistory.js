import React, { useEffect } from "react";
import { Container, Jumbotron } from "react-bootstrap";

import ResultsTable from "../../components/results/resultsTable";
import { addResult } from "../../appstore/resultSlice";
import { addDeck } from "../../appstore/deckSlice";
import store from "../../appstore/store";

export default function MatchHistoryView(props) {
  const onclick = () => {
    const item = { game_id: 1, result: "Loss" };
    store.dispatch(addResult(item));
    console.log(`DISPATCH ${JSON.stringify(item)}`);
  };

  useEffect(() => {
    async function get_data() {
      const games = await window.eel.get_all_games()();
      const decks = await window.eel.get_all_decks()();
      games.map(g => {
        store.dispatch(addResult(g));
      });

      decks.map(d => {
        store.dispatch(addDeck(d));
      });
    }
    get_data();
  }, []);

  return (
    <Container>
      <Jumbotron
        style={{
          marginTop: "50px",
          backgroundColor: "slategrey",
          backgroundImage:
            "url(http://lolwp.com/wp-content/uploads/Twisted-Fate-Splash-Updated.jpg)",
          backgroundSize: "cover"
        }}
      >
        <h1>Twisted Fate</h1>
        <p>
          A deck and match performance tracking companion app for Legend of
          Runeterra
        </p>
      </Jumbotron>
      <ResultsTable />
    </Container>
  );
}
