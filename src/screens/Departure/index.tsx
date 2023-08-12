import React, { useRef } from 'react';
import { ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Container, Content } from './styles';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput/inde';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Button } from '../../components/Button';

const keyboardAvoidingViewBehavior = Platform.OS === 'android'? 'height' : 'position'

export function Departure() {

  const descriptionRef = useRef<TextInput>(null)

  function handleDepartureRegister() {
    console.log('Ok')
  }

  return (
    <Container>
      <Header title='Saída'/>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardAvoidingViewBehavior}>
        <ScrollView>
          <Content>
            <LicensePlateInput 
              label='Placa do veículo'
              placeholder='BRA1234'
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType='next'
            />

            <TextAreaInput 
              ref={descriptionRef}
              label='Finalidade'
              placeholder='Vou utilizar o veículo para ...'
              onSubmitEditing={() => handleDepartureRegister()}
              returnKeyType='send'
              blurOnSubmit
            />


            <Button 
              title='Registrar Saída'
              onPress={handleDepartureRegister}
            />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}