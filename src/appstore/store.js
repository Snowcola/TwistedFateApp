import { createStore, combineReducers } from 'redux'
import results from './resultSlice'
import decks from './deckSlice'

const reducers = combineReducers({
    results: results,
    decks: decks,
})

const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store