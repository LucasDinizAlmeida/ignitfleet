import React from 'react';
import { Car, FlagCheckered } from 'phosphor-react-native';
import { Container, Line } from './styles';
import { LocationInfo, LocationInfoProps } from '../LocationInfo';

interface Props {
    departure: LocationInfoProps,
    arrival?: LocationInfoProps | null
}

export function Locations({ arrival = null, departure }: Props) {
  return (
    <Container>
        <LocationInfo 
            label={departure.label}
            description={departure.description}
            icon={Car}
        />

        {
          arrival &&
          <>
            <Line />

            <LocationInfo 
                label={arrival.label}
                description={arrival.description}
                icon={FlagCheckered}
            />
          </>
        }

    </Container>
  );
}