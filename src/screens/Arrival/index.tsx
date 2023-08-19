import React, { useEffect, useState } from 'react';
import { Container, Content, Description, LicensePlate, Label, Footer, AsyncMessage } from './styles';
import { X } from 'phosphor-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon/inde';

import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { BSON } from 'realm';
import { Alert } from 'react-native';
import { getLastAsyncTimeStamp } from '../../libs/asyncStorage/styncStorage';
import { stopLocationTask } from '../../tasks/backgrundTaskLocation';
import { getLocationStorage } from '../../libs/asyncStorage/locationStorage';
import { LatLng } from 'react-native-maps';
import { Map } from '../../components/Map';

interface RouteParamsProps {
  id: string
}

export function Arrival() {

  const [dataNotSynced, setDataNotSynced] = useState(false)
  const [coordinates, setCoordinates] = useState<LatLng[]>([])

  const { goBack } = useNavigation()

  const route = useRoute()

  const { id } = route.params as RouteParamsProps
  
  const historic = useObject(Historic, new BSON.UUID(id) as unknown as string);
  const realm = useRealm()

  const title = historic?.status === 'departure'? 'Em uso' : 'Detalhes'

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic)
    })

    await stopLocationTask()

    goBack()
  }
    

  function handleRemoveVehicleUsage() {
    Alert.alert(
      'Cancelar',
      'Cancelar a utilização do veículo?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => removeVehicleUsage()}
      ]
    )
  }

  async function handleRegisterArrival() {

    try {
      if(!historic) {
        return Alert.alert('Error', 'Não foi possível acessar os dados do veículo.')
      } 
      
      

      realm.write(() => {
        historic.status = 'arrival' 
        historic.updated_at = new Date()
      })

      await stopLocationTask()

      
      Alert.alert('Chegada', 'Chegada registrada com sucesso.')

      goBack()
       

    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Não foi possível registrar a chegada do veículo.')
    }
  }

  async function getLocationInfo() {
    if(!historic) {
      return
    }
    const lastsync = await getLastAsyncTimeStamp()
    const updatedAt = historic!.updated_at.getTime()
    setDataNotSynced(lastsync < updatedAt)

    const locationStorage = await getLocationStorage()
    setCoordinates(locationStorage)
  }

  useEffect(() => {
    getLocationInfo()
  }, [historic])
  

  return (
    <Container>
      <Header title={title}/>
      {
        coordinates.length > 0 && <Map coordinates={coordinates}/>
      }

      <Content>
        <Label>
          Placa do veículo
        </Label>
        <LicensePlate>
          {historic?.license_plate}
        </LicensePlate>

        <Label>
          Finalidade 
        </Label>
        <Description>
          {historic?.description}
        </Description>
        
      </Content>
      {
        historic?.status === 'departure' &&
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage}/>
          <Button 
            title='Registrar Chegada'
            onPress={handleRegisterArrival}
          />
        </Footer>
      }

      {
        dataNotSynced &&
        <AsyncMessage>
          Sincronização da {historic?.status === 'departure'? 'partida' : 'chegada'} pendente.
        </AsyncMessage>

      }

    </Container>
  );
}