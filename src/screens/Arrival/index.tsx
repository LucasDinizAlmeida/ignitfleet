import React from 'react';
import { Container, Content, Description, LicensePlate, Label, Footer } from './styles';
import { X } from 'phosphor-react-native';
import { useRoute } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon/inde';

interface RouteParamsProps {
  id: string
}

export function Arrival() {

  const route = useRoute()

  const { id } = route.params as RouteParamsProps
  console.log(id)

  return (
    <Container>
      <Header title='Chegada'/>

      <Content>
        <Label>
          Placa do veículo
        </Label>
        <LicensePlate>
          XXX000
        </LicensePlate>

        <Label>
          Finalidade 
        </Label>
        <Description>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus iure dolores magnam facere fugiat repellat nostrum eaque voluptas soluta distinctio, voluptates veniam, eveniet placeat minima beatae adipisci, fugit assumenda molestiae.
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