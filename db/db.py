from flask import Flask
from sqlalchemy import create_engine
from datetime import datetime
import os

from marshmallow_sqlalchemy import ModelSchema
from marshmallow_sqlalchemy.fields import Nested
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

db_location = os.path.join(os.environ["APPDATA"], "twisted_fate")
if not os.path.exists(db_location):
    os.makedirs(db_location)
db_path = os.path.join(db_location, "twisted_fate.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


class GameResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    player = db.Column(db.String)
    opponent = db.Column(db.String)
    opponent_decklist = db.Column(db.Text)
    opponent_regions = db.Column(db.Text)
    opponent_champions = db.Column(db.Text)
    player_decklist = db.Column(db.Text)
    win = db.Column(db.Boolean)
    player_deck_id = db.Column(db.Integer, db.ForeignKey("deck.id"))
    mode = db.Column(db.String)

    def __repr__(self):
        return f"<GameResult {self.id}>"


class Deck(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    create_date = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    deck_code = db.Column(db.String)
    deck_list = db.Column(db.Text)
    regions = db.Column(db.Text)
    champions = db.Column(db.Text)
    wins = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)
    win_rate_v_factions = db.Column(db.Text)
    games = db.relationship("GameResult", backref="player_deck", lazy="dynamic")

    def __repr__(self):
        return f"<Deck {self.id}>"


class SmartNested(Nested):
    def serialize(self, attr, obj, accessor=None):
        if attr not in obj.__dict__:
            return {"id": int(getattr(obj, attr + "_id"))}
        return super(SmartNested, self).serialize(attr, obj, accessor)


class BaseSchema(ModelSchema):
    class Meta:
        sqla_session = db.session


class DeckSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = Deck


class GameResultSchema(BaseSchema):
    player_deck = Nested(DeckSchema)

    class Meta(BaseSchema.Meta):
        model = GameResult


db.create_all()
