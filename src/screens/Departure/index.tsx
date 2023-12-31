import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ScrollView, TextInput, Alert } from 'react-native';
import { Container, Content, Message, MessageContainer } from './styles';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput/inde';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Button } from '../../components/Button';
import { licensePlateValidate } from '../../utils/licensesPlateValidate';
import { getAddressLocation } from '../../utils/getAddressLocation'

import { useForegroundPermissions, watchPositionAsync, LocationAccuracy, LocationSubscription, LocationObjectCoords, requestBackgroundPermissionsAsync } from 'expo-location';

import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useUser } from '@realm/react';
import { useNavigation } from '@react-navigation/native';
import { Loading } from '../../components/Loading';
import { LocationInfo } from '../../components/LocationInfo';
import { Car } from 'phosphor-react-native';
import { Map } from '../../components/Map';
import { startLocationTask } from '../../tasks/backgrundTaskLocation';
import { openSetting } from '../../utils/openSettings';

export function Departure() {

  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [currentCoords, setCurrentCoords] = useState<LocationObjectCoords | null>(null)

  const [locationForegroundPermission, requestLocationForegroundPermission] = useForegroundPermissions()

  const realm = useRealm()
  const user = useUser()

  const { navigate } = useNavigation()

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  async function handleDepartureRegister() {

    try {
      if(!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus()
        return Alert.alert('Placa inválida', 'Placa inválida. Por favor, informe a placa correta do veículo.')
      }
  
      if(description.trim().length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert('Finalidade', 'Por favor, informe a finalidade de uso do veículo')
      }

      if(!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert('Localização', 'Não foi possível obter a localização atual, tente novamente.')
      }
  
      setIsRegistering(true)

      const backgroundLocationPermission = await requestBackgroundPermissionsAsync()

      if(!backgroundLocationPermission.granted) {
        setIsRegistering(false)
        return Alert.alert(
          'Localização', 
          'É necessário permitir que o App tenha acesso a localização em segundo plano. Acesse as configurações do dispositovo e habilite "Permitir o tempo todo"',
          [{ text: 'Abrir configurações', onPress: openSetting }]
        )
      }

      await startLocationTask()

      realm.write(() => {
        realm.create('Historic', Historic.generate({
          user_id: user!.id,
          license_plate: licensePlate,
          description: description,
          coords: [
            {
              latitude: currentCoords.latitude,
              longitude: currentCoords.longitude,
              timestamp: new Date().getTime()
            }
          ]
        }))
      })

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso.')

      navigate('home')

    } catch (error) {
      console.log(error)
      setIsRegistering(false)
    }
    
  }

  useEffect(() => {
    requestLocationForegroundPermission()
  }, [])


  useEffect(() => {
    if(!locationForegroundPermission?.granted) {
      return
    }

    let subscription: LocationSubscription

    watchPositionAsync({
      accuracy: LocationAccuracy.High,
      timeInterval: 1000
    }, (location) => {
      setCurrentCoords(location.coords)

      getAddressLocation(location.coords)
        .then(address => {
          if(address) {
            setCurrentAddress(address)
          }
        })
        .finally(() => setIsLoadingLocation(false))
    })
      .then(response => subscription = response)

    return () => {
      if(subscription) {
        subscription.remove()
      }
    }
  }, [locationForegroundPermission])


  if(!locationForegroundPermission?.granted) {
     return (
      <Container>
        <Header title='Saída'/>

          <MessageContainer>
            <Message>
              Você precisa permitir que o aplicativo tenha acesso a localização paa utilizar essa funcionalidade. 
              Por favor, acesse as configurações do se dispositivo para conceder essa permissçao ao aplicativo.
            </Message>
            <Button title='Abrir configurações' onPress={openSetting}/>
          </MessageContainer>
        
      </Container>
     )
  }

  if(isLoadingLocation) {
    return <Loading />
  }

  return (
    <Container>
      <Header title='Saída'/>

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {
            currentCoords && 
            <Map 
              coordinates={[
                currentCoords
              ]}
            />
          }
          <Content>
            {
              currentAddress &&
              <LocationInfo 
                icon={Car}
                label='Localização atual'
                description={currentAddress}
              />
            }

            <LicensePlateInput 
              ref={licensePlateRef}
              label='Placa do veículo'
              placeholder='BRA1234'
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType='next'
              onChangeText={setLicensePlate}
            />

            <TextAreaInput 
              ref={descriptionRef}
              label='Finalidade'
              placeholder='Vou utilizar o veículo para ...'
              onSubmitEditing={() => handleDepartureRegister()}
              returnKeyType='send'
              blurOnSubmit
              onChangeText={setDescription}
            />


            <Button 
              title='Registrar Saída'
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  );
}