import MapView, { PROVIDER_GOOGLE, MapViewProps, LatLng, Marker } from "react-native-maps";
import { IconBox } from "../IconBox";
import { Car, FlagCheckered } from "phosphor-react-native";
import { useRef } from "react";

interface Props extends MapViewProps {
    coordinates: LatLng[]
}

export function Map({ coordinates }: Props) {

    const mapRef = useRef<MapView>(null)
    const lastCoordinates = coordinates[coordinates.length - 1]

    async function onMapLoaded() {
        if(coordinates.length > 1) {
            mapRef.current?.fitToSuppliedMarkers(['departure', 'arrival'], {
                edgePadding: { top: 50, bottom: 50, left: 50, right: 50}
            })
        }
    }

    return (
        <MapView 
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ width: '100%', height: 200 }}
            region={{
                latitude: lastCoordinates.latitude,
                longitude: lastCoordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }}
            onMapLoaded={onMapLoaded}
        >
            <Marker coordinate={coordinates[0]} identifier="departure">
                <IconBox size="SMALL" icon={Car}/>
            </Marker>

            {
                coordinates.length > 1 &&
                <Marker coordinate={lastCoordinates} identifier="arrival">
                <IconBox size="SMALL" icon={FlagCheckered}/>
            </Marker>
            }
        </MapView>
    )
}