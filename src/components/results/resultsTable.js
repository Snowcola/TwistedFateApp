import React from "react"
import { connect } from 'react-redux'
import moment from 'moment'
import { Accordion } from 'react-bootstrap'

import { actions } from '../../appstore/resultSlice'
import GameResult from './gameResult'


function Results({ results }) {

    return (
        <div>
            <Accordion>
                {Object.keys(results).reverse().map(item => {
                    const result = results[item]
                    return (
                        <GameResult result={result} key={result.id} />
                    )
                }
                )}
            </Accordion>
        </div>
    )
}

const mapStateToProps = state => ({
    results: state.results
})
const mapDispatchToProps = null


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Results)