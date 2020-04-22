"""Main Python application file for the EEL-CRA demo."""

import os
import platform
import random
import sys
import logging
import eel
import json

import os

print("PYTHONPATH:", os.environ.get("PYTHONPATH"))
import twisted_fate as tf
from twisted_fate import LoRClient

from db.db import GameResult, Deck, db, GameResultSchema, DeckSchema

logging.getLogger("TwistedFateLib").setLevel(logging.ERROR)

logger = logging.getLogger("TwistedFate")
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(name)s :: %(levelname)s | %(message)s")
ch.setFormatter(formatter)
if logger.hasHandlers():
    logger.handlers.clear()
# logger.addHandler(ch)

# Use latest version of Eel from parent directory
sys.path.insert(1, "../../")

client = LoRClient("no-api-key")


@eel.expose
def get_decklist(deck_code):
    deck = tf.Deck.decode(deck_code)
    print(f"creating deck from {deck_code}")
    return deck.serialize()["cards"]


@eel.expose
def get_current_decklist():
    decks = [
        "CEBAGAIDCQRSOCQBAQAQYDISDQTCOKBNGQAACAIBAMFQ",
        "CEBAMAICCMQCKKZQG4DQCAAJDIOSAJJNGUAACAIBAADQ",
        "CEAQ2AIEAECAQCQZDYPSILRRGQ2TUAABAEAQIBI",
        "CEBAIAIBBEGSGLQFAEBQKBQ6F4ZAEAIBAEWQGAIDCMQDIAQBAEARIBABAMLB2KZQ",
    ]
    deck_code = random.choice(decks)
    return get_decklist(deck_code)


@eel.expose
def get_all_decks():
    schema = DeckSchema(many=True)
    decks = Deck.query.all()
    return schema.dump(decks)


@eel.expose
def get_all_games():
    schema = GameResultSchema(many=True)
    games = GameResult.query.all()
    return schema.dump(games)


@eel.expose
def websocketClosed(path, socketlist):
    global dev
    print("GUI Eel Socket Restart")
    eel.sleep(2)
    if socketlist:
        pass
    else:
        start_eel(develop=dev)


def start_eel(develop):
    """Start Eel with either production or development configuration."""
    global dev
    dev = develop
    if develop:
        directory = "src"
        app = "chrome-app"
        page = {"port": 3000}
    else:
        directory = "build"
        app = None
        page = "index.html"

    eel.init(directory, [".tsx", ".ts", ".jsx", ".js", ".html"])

    eel_kwargs = dict(
        host="localhost",
        port=8080,
        size=(1280, 840),
        block=False,
        close_callback=websocketClosed,
        # args=["electron/twisted-fate/dist/win-unpacked/twisted-fate.exe", "."],
    )
    try:
        print(app)
        eel.start(page, mode=app, **eel_kwargs)
    except EnvironmentError as e:
        print("falling back on edge", e)
        # If Chrome isn't found, fallback to Microsoft Edge on Win10 or greater
        if sys.platform in ["win32", "win64"] and int(platform.release()) >= 10:
            eel.start(page, mode="edge", **eel_kwargs)
        else:
            raise


def find_or_create_deck(db, player_deck):

    deck = Deck.query.filter_by(deck_code=player_deck.to_deck_code()).first()
    if not deck:
        deck = Deck(
            deck_code=player_deck.to_deck_code(),
            deck_list=json.dumps(
                [
                    {"card": card.cardCode, "count": card.count}
                    for card in player_deck.cards
                ]
            ),
            regions=json.dumps(player_deck.regions()),
            champions=json.dumps(player_deck.champions()),
        )
        db.session.add(deck)
        db.session.commit()
    return deck


def store_game_data(db, current_game_data, deck):
    # TODO: update winrate vs regions with DB
    mode = "Normal"  # eventuall use to differentiate games played in different modes

    result = GameResult(
        player=current_game_data.player,
        opponent=current_game_data.opponent,
        opponent_decklist=json.dumps(
            [
                {"card": card.cardCode, "count": card.count}
                for card in current_game_data.opponent_cards_used.cards
            ]
        ),
        opponent_regions=json.dumps(current_game_data.opponent_cards_used.regions()),
        opponent_champions=json.dumps(
            current_game_data.opponent_cards_used.champions()
        ),
        win=current_game_data.result.is_winner,
        mode=mode,
        player_deck=deck,
        player_decklist=json.dumps(
            [
                {"card": card.cardCode, "count": card.count}
                for card in current_game_data.player_cards_used.cards
            ]
        ),
    )
    db.session.add(result)

    if current_game_data.result.is_winner:
        deck.wins = deck.wins + 1
    else:
        deck.losses = deck.losses + 1
    db.session.commit()
    return result, deck


def initialize_game(frame):
    # TODO: check for normal vs expeditions
    logger.debug("Game Started")
    current_deck = client.current_decklist()
    current_game_data = tf.Game(
        frame.player, frame.opponent, frame.screen, current_deck
    )
    return current_game_data


def polling_thread():
    previous_game_state = None
    previous_game_data = None
    current_game_data = None

    while True:
        current_frame = client.card_positions()
        if not current_frame:
            continue
        # logging.debug("Current Frame", current_frame.rectangles)

        if current_frame.game_state == "InProgress" and previous_game_state == "Menus":
            previous_game_data = current_game_data
            current_game_data = initialize_game(current_frame)

        elif current_frame.game_state == "InProgress" == previous_game_state:
            # game in progress
            if not current_game_data:
                current_game_data = initialize_game(current_frame)

            current_game_data.process_frame(current_frame)

        elif (
            current_frame.game_state == "Menus" and previous_game_state == "InProgress"
        ):
            if current_game_data:
                current_game_data.result = client.game_status()
                logger.debug(f"<Result(Win: {current_game_data.result.is_winner})>")

                # TODO: characterize opponent deck (aggro/control/midrange)

                # add game record to db
                deck = find_or_create_deck(db, current_game_data.initial_player_deck)
                game_result, deck_update = store_game_data(db, current_game_data, deck)
                # TODO: send to front end
                # eel.addGameResult(GameResultSchema().dump(game_result))
                # eel.updateDeck(DeckSchema().dump(deck_update))
                previous_game_data = current_game_data
        else:
            pass

        previous_game_state = current_frame.game_state
        eel.sleep(1)


dev = None

if __name__ == "__main__":
    import sys

    eel.spawn(polling_thread)
    # Pass any second argument to enable debugging
    start_eel(develop=len(sys.argv) == 2)

    while True:
        eel.sleep(1)
