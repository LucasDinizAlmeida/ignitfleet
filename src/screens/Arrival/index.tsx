import React from 'react';
import { Container, Content, Description, LicensePlate, Label, Footer } from './styles';
import { X } from 'phosphor-react-native';
import { useRoute } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon/inde';

import { useObject } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { BSON } from 'realm';

interface RouteParamsProps {
  id: string
}

export function Arrival() {

  const route = useRoute()

  const { id } = route.params as RouteParamsProps
  
  const historic = useObject(Historic, new BSON.UUID(id) as unknown as string);

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
          <ButtonIcon icon={X}/>
          <Button 
            title='Registrar Chegada'
          />
        </Footer>
      </Content>
    </Container>
  );
}