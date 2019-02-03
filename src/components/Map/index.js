import React, { Component, Fragment } from 'react';
import { View, Image, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import Search from '../Search';
import Directions from '../Directions';
import getPixelSize, { API_KEY } from '../../utils';
import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';
import  { 
    Back,
    LocationBox, 
    LocationText, 
    LocationTimeBox, 
    LocationTimeText,
    LocationTimeTextSmall
} from './styles';



// https://github.com/marlove/react-native-geocoding
import Geocoder from 'react-native-geocoding'
import Details from '../Details';


const LATITUDE_DELTA = 0.0143;
const LONGITUDE_DELTA = 0.134;

/* 
    TUTORIAL:
        https://www.youtube.com/watch?v=bg-U0xZwcRk&index=13&list=PL85ITvJ7FLojBfY7TifCq7P417AZdsP4k

    API DOC:
        https://github.com/react-native-community/react-native-maps
        https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md    
*/

Geocoder.init(API_KEY);

export default class Map extends Component {


    constructor(props) {
        super(props);
    
        this.state = { 
            location: null,
            region: null,
            destination: null,
            duration: null,
        };   
      }    

    handleLocationSelected = (data, { geometry } ) => {
        //desestructing geometry, getting lat and lng, nut now with new names: latitude and longitude
        const { location: { lat: latitude, lng: longitude } } = geometry;
        this.setState({
            destination: {
                latitude,
                longitude,
                title: data.structured_formatting.main_text
            }
        })
    }


    handleBack = () => {
        this.setState({
            destination: null
        });
    }

    async componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                //success callback
                const response = await Geocoder.from({ latitude, longitude  });
                const address = response.results[0].formatted_address;
                const location =  address.substring(0, address.indexOf(','));

                this.setState({
                    locationFound: true,
                    location,
                    region: {
                        latitude,
                        longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                });
            },
            () => {}, //error callback
            {
                timeout: 20000, //tempo para tenta pegar a localização do usuario.
                enableHighAccuracy: true, //localização via GPS, mais real. false -> wifi location
                maximumAge: 1000, //intervalos de um segundo para pegar a localização.
            }
        )
    }

    
    render() {
        
        const { region, destination, duration, location } = this.state;

        return(
            <View style={{flex: 1}}>
                <StatusBar translucent={true} backgroundColor={'transparent'}  />
                <MapView
                    style={{flex:1}} 
                    initialRegion={region}
                    showsUserLocation
                    loadingEnabled
                    ref={c => this.mapView = c} >
                    { destination && (
                        <Fragment>
                            <Directions 
                                origin={region}
                                destination={destination}
                                onReady={
                                    result => {

                                        this.setState({
                                            duration: Math.floor(result.duration)
                                        })

                                        this.mapView.fitToCoordinates(result.coordinates, {
                                            edgePadding: {
                                                right: getPixelSize(50),
                                                left: getPixelSize(50),
                                                top: getPixelSize(50),
                                                bottom: getPixelSize(350),                                                
                                            },
                                            animated: true
                                        });
                                }} />
                                <Marker 
                                    coordinate={region} 
                                    anchor={{ x: 0, y: 0 }}>
                                    <LocationBox>
                                        <LocationTimeBox>
                                            <LocationTimeText>{duration}</LocationTimeText>
                                            <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                                        </LocationTimeBox>                                        
                                        <LocationText>{location}</LocationText>
                                    </LocationBox>
                                </Marker>                                
                                <Marker 
                                    coordinate={destination} 
                                    anchor={{ x: 0, y: 0 }} 
                                    image={markerImage}>
                                    <LocationBox>
                                        <LocationText>{destination.title}</LocationText>
                                    </LocationBox>
                                </Marker>
                        </Fragment>
                    )  }
                </MapView>
                {destination ? (
                    <Fragment>
                        <Back onPress={this.handleBack}>
                            <Image source={backImage} />
                        </Back>
                        <Details />
                    </Fragment>
                ) : (
                    <Search 
                        onLocationSelected={ this.handleLocationSelected } />
                )}                
            </View>            
        )
    }

}
