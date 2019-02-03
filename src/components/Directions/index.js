import React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from '../../utils';

// https://github.com/bramus/react-native-maps-directions



export default Directions = ({ destination, origin, onReady }) => (
    <MapViewDirections 
        destination={destination}
        origin={origin}
        onReady={onReady}
        apikey={API_KEY}
        strokeWidth={3}
        strokeColor='#222'
    />
);
