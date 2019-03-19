import React, { Component} from 'react';
// import ReactDOM from 'react-dom';

// import MapContainer from './Map';

const searchStyles = {
    bar: {
        bottom: '0',
        margin:'auto',
        zIndex: '-1',
        position: 'absolute'
    }
};

export class Home extends Component {
    render() {
        return(
            <div style={searchStyles.bar}>
                <p>Where to?</p>
            </div>
        )
    }
}

export default Home;