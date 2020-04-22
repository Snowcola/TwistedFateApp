import { createSlice } from "@reduxjs/toolkit";

const resultsSlice = createSlice({
  name: "results",
  initialState: {},
  reducers: {
    addResult: {
      reducer(state, action) {
        return Object.assign({}, state, {
          [action.payload.id]: action.payload
        });
      },
      prepare(value) {
        const champions = JSON.parse(value.player_deck.champions);
        const oppo_champions = JSON.parse(value.opponent_champions);
        const regions = JSON.parse(value.player_deck.regions);
        const oppo_regions = JSON.parse(value.opponent_regions);
        const oppo_decklist = JSON.parse(value.opponent_decklist);
        const decklist = JSON.parse(value.player_deck.deck_list);
        const player_decklist = JSON.parse(value.player_decklist);
        value.player_deck.regions = regions;
        value.player_deck.champions = champions;
        value.player_deck.deck_list = decklist;
        value.opponent_regions = oppo_regions;
        value.opponent_decklist = oppo_decklist;
        value.opponent_champions = oppo_champions;
        value.player_decklist = player_decklist;
        return { payload: { ...value } };
      }
    }
  }
});

export const { addResult } = resultsSlice.actions;

export default resultsSlice.reducer;
