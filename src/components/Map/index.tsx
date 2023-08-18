import MapView, { PROVIDER_GOOGLE, MapViewProps, LatLng, Marker } from "react-native-maps";
import { IconBox } from "../IconBox";
import { Car, FlagCheckered } from "phosphor-react-native";

interface Props extends MapViewProps {
    coordinates: LatLng[]
}

export function Map({ coordinates }: Props) {

    const lastCoordinates = coordinates[coordinates.length - 1]

    return (
        <MapView 
            provider={PROVIDER_GOOGLE}
            style={{ width: '100%', height: 200 }}
            region={{
                latitude: lastCoordinates.latitude,
                longitude: lastCoordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }}
        >
            <Marker coordinate={coordinates[0]}>
                <IconBox size="SMALL" icon={Car}/>
            </Marker>

            {
                coordinates.length > 1 &&
                <Marker coordinate={lastCoordinates}>
                <IconBox size="SMALL" icon={FlagCheckered}/>
            </Marker>
            }
        </MapView>
    )
}