import { createSlice } from '@reduxjs/toolkit'


const decksSlice = createSlice({
    name: 'decks',
    initialState: {},
    reducers: {
        addDeck: {
            reducer(state, action) {
                return Object.assign({}, state, { [action.payload.id]: action.payload })

            },
        }
    }
})

export const { addDeck } = decksSlice.actions

export default decksSlice.reducer

