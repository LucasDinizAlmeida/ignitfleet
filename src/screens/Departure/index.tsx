import React, { useRef, useState } from 'react';
import { ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Container, Content } from './styles';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput/inde';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Button } from '../../components/Button';
import { licensePlateValidate } from '../../utils/licensesPlateValidate';

import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useUser } from '@realm/react';
import { useNavigation } from '@react-navigation/native';

const keyboardAvoidingViewBehavior = Platform.OS === 'android'? 'height' : 'position'

export function Departure() {

  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const realm = useRealm()
  const user = useUser()

  const { navigate } = useNavigation()

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  function handleDepartureRegister() {

    try {
      if(!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus()
        return Alert.alert('Placa inválida', 'Placa inválida. Por favor, informe a placa correta do veículo.')
      }
  
      if(description.trim().length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert('Finalidade', 'Por favor, informe a finalidade de uso do veículo')
      }
  
      setIsRegistering(true)
      realm.write(() => {
        realm.create('Historic', Historic.generate({
          user_id: user!.id,
          license_plate: licensePlate,
          description: description
        }))
      })

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso.')

      navigate('home')

    } catch (error) {
      console.log(error)
      setIsRegistering(false)
    }
    
  }

  return (
    <Container>
      <Header title='Saída'/>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardAvoidingViewBehavior}>
        <ScrollView>
          <Content>
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
      </KeyboardAvoidingView>
    </Container>
  );
}