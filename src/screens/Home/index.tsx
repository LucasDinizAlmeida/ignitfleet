import React, { useEffect, useState } from 'react';
import { Container, Content } from './styles';
import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

export function Home() {

  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)

  const { navigate } = useNavigation()
  const historic = useQuery(Historic)

  function handleRegisterMovement() {
    if(vehicleInUse?._id) {
      navigate('arrival', { id: vehicleInUse._id.toString() })
    } else {
      navigate('departure')
    }
  }

  function fetchVehicle() {
    const vehicle = historic.filtered("status = 'departure'")[0]
    setVehicleInUse(vehicle)
  }

  useEffect(() => {
    fetchVehicle()
  }, [])

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus 
          onPress={handleRegisterMovement}
          licensePlate={vehicleInUse?.license_plate}
        />
      </Content>
    </Container>
  );
}