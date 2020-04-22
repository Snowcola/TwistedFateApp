import React, { Component } from "react";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/index.css";

//import DeckView from './components/views/Deck'
import MatchHistoryView from "./components/views/MatchHistory";
import store from "./appstore/store";
import { addResult } from "./appstore/resultSlice";
import { addDeck } from "./appstore/deckSlice";

// Point Eel web socket to the instance
export const eel = window.eel;

eel.set_host("ws://localhost:8080");
//eel.set_host('https://8080-b5be3ee1-d9a1-472f-93ae-2e91b6e8fc5f.ws-us02.gitpod.io:443')

//window.eel.expose(sayHelloJS, 'say_hello_js')

eel.expose(addGameResult);
function addGameResult(payload) {
  store.dispatch(addResult(payload));
}

eel.expose(updateDeck);
function updateDeck(payload) {
  store.dispatch(addDeck(payload));
}

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

setInterval(() => {
  get_data();
}, 1000);

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <header className="App-header">
          <MatchHistoryView />
        </header>
      </Provider>
    );
  }
}

export default App;
