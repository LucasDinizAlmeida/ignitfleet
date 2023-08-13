import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Home } from '../screens/Home'
import { Departure } from '../screens/Departure'
import { Arrival } from '../screens/Arrival'

type RootParamlist = {
    home: undefined
    departure: undefined
    arrival: {
        id: string
    }
}
// export type AppNavigatorRoutesProps = NativeStackNavigationProp<RootParamlist>

const { Navigator, Screen } = createNativeStackNavigator<RootParamlist>()

export function AppRoutes() {

    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen 
                name='home'
                component={Home}
            />
            <Screen 
                name='departure'
                component={Departure}
            />
            <Screen 
                name='arrival'
                component={Arrival}
            />
        </Navigator>
    )
}