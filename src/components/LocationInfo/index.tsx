import React from 'react';
import { Container, Description, Info, Label } from './styles';

interface Props {
    label: string
    description: string
}


export function LocationInfo({ label, description }: Props) {
  return (
    <Container>

        <Info>
            <Label>
                {label}
            </Label>
            <Description>
                {description}
            </Description>
        </Info>
    </Container>
  );
}