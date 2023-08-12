import React from 'react';
import { Container, Content } from './styles';
import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';

export function Home() {



  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus licensePlate='XXX-000'/>
      </Content>
    </Container>
  );
}