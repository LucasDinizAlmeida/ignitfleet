import React from 'react';
import { Container, Content, Description, LicensePlate, Label, Footer } from './styles';
import { X } from 'phosphor-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon/inde';

import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { BSON } from 'realm';
import { Alert } from 'react-native';

interface RouteParamsProps {
  id: string
}

export function Arrival() {

  const { goBack } = useNavigation()

  const route = useRoute()

  const { id } = route.params as RouteParamsProps
  
  const historic = useObject(Historic, new BSON.UUID(id) as unknown as string);
  const realm = useRealm()

  function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic)
    })

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
  

  return (
    <Container>
      <Header title='Chegada'/>

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


        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage}/>
          <Button 
            title='Registrar Chegada'
          />
        </Footer>
      </Content>
    </Container>
  );
}