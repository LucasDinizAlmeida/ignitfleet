
import { TouchableOpacityProps } from 'react-native';
import { Check, ClockClockwise } from 'phosphor-react-native';
import { Container, Departure, Info, LicensePlate } from './styles';
import { useTheme } from 'styled-components';

export type HistoricCardProps = {
    id: string
    licensePlate: string
    created: string
    isSync: boolean
}

interface Props extends TouchableOpacityProps {
    data: HistoricCardProps
}

export function HistoricCard({ data, ...rest}: Props) {
    

    const theme = useTheme()

  return (
    <Container
        activeOpacity={0.7}
        {...rest}
    >
        <Info>
            <LicensePlate>
                {data.licensePlate}
            </LicensePlate>
            <Departure>
                {data.created}
            </Departure>
        </Info>

        {
            data.isSync ?
            <Check 
                size={24}
                color={theme.COLORS.BRAND_LIGHT}
            />
            :
            <ClockClockwise 
                size={24}
                color={theme.COLORS.GRAY_400}
            />
        }
    </Container>
  );
}