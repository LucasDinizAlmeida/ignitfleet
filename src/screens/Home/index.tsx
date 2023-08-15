import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { Container, Content, Label, Title } from './styles';
import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { useNavigation } from '@react-navigation/native';
import { Historic } from '../../libs/realm/schemas/Historic';

import { useQuery, useRealm } from '../../libs/realm';
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard';
import dayjs from 'dayjs';

export function Home() {

  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>([])

  const { navigate } = useNavigation()

  const historic = useQuery(Historic)
  const realm = useRealm()


  function handleHistoricDetails(id: string) {
    navigate('arrival', { id })
  }

  function handleRegisterMovement() {
    if(vehicleInUse?._id) {
      navigate('arrival', { id: vehicleInUse._id.toString() })
    } else {
      navigate('departure')
    }
  }

  function fetchVehicleInUse() {
    const vehicle = historic.filtered("status = 'departure'")[0]
    setVehicleInUse(vehicle)
  }

  function fetchHistoric() {
    try {
      const vehicles = historic.filtered("status = 'arrival' SORT(created_at DESC)")
      
      const formattedHistoric = vehicles.map((item) => {
        return ({
          id: item._id!.toString(),
          licensePlate: item.license_plate,
          isSync: false,
          created: dayjs(item.created_at).format('[Saída em] DD/MM/YYYY [às] HH:mm')
        })
      })

      setVehicleHistoric(formattedHistoric)
      
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Não foi possível acessar o historico de veículos usados.')
    }
  }

  useEffect(() => {
    fetchHistoric()
  }, [historic])

  useEffect(() => {
    fetchVehicleInUse()
  }, [])

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse())

    return () => {
      if(realm && !realm.isClosed) {
        realm.removeListener('change', fetchVehicleInUse)
      }
    }
  }, [])

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus 
          onPress={handleRegisterMovement}
          licensePlate={vehicleInUse?.license_plate}
        />

        <Title>
          Histórico
        </Title>

        <FlatList 
          data={vehicleHistoric}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoricCard 
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: 100 }}
          ListEmptyComponent={() => (
            <Label>
              Nenhum registro de utilização
            </Label>
          )}
        />
      </Content>
    </Container>
  );
}