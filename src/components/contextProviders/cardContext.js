import React, { useState } from 'react';

const CardContext = React.createContext([{}, () => { }]);

const CardContextProvider = (props) => {
    const [state, setState] = useState({})
    return (
        <CardContext.Provider value={[state, setState]}>
            {props.children}
        </CardContext.Provider>
    );
}

export { CardContext, CardContextProvider };