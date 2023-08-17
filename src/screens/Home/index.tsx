import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { Container, Content, Label, Title } from './styles';
import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { useNavigation } from '@react-navigation/native';
import { Historic } from '../../libs/realm/schemas/Historic';

import { useUser } from '@realm/react';
import { useQuery, useRealm } from '../../libs/realm';
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard';
import dayjs from 'dayjs';
import { getLastAsyncTimeStamp, saveLastSyncTimestamp } from '../../libs/asyncStorage/styncStorage';
import Toast from 'react-native-toast-message';

export function Home() {

  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>([])

  const { navigate } = useNavigation()

  const historic = useQuery(Historic)
  const realm = useRealm()
  const user = useUser()


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

  async function fetchHistoric() {
    try {
      const vehicles = historic.filtered("status = 'arrival' SORT(created_at DESC)")

      const lastSync = await getLastAsyncTimeStamp()
      
      const formattedHistoric = vehicles.map((item) => {
        return ({
          id: item._id!.toString(),
          licensePlate: item.license_plate,
          isSync: lastSync > item.updated_at!.getTime(),
          created: dayjs(item.created_at).format('[Saída em] DD/MM/YYYY [às] HH:mm')
        })
      })

      setVehicleHistoric(formattedHistoric)
      
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Não foi possível acessar o historico de veículos usados.')
    }
  }

  async function progressNotification(transferred: number, transferable: number) {
    const percentage = (transferred / transferable) * 100

    if(percentage === 100) {
      await saveLastSyncTimestamp()
      fetchHistoric()
      Toast.show({
        type: 'info',
        text1: 'Todos os dados foram sincronizados.'
      })
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

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historicByUserQuery = realm.objects('Historic').filtered(`user_id = '${user!.id}'`)
    
      mutableSubs.add(historicByUserQuery, { name: 'historic_by_user'})
    })
  }, [])

  useEffect(() => {
    const syncSession = realm.syncSession

    if(!syncSession) {
      return
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification
    )

    return () => syncSession.removeProgressNotification(progressNotification)
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