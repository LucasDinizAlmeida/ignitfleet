import React from 'react';
import { Container, Description, Info, Label } from './styles';
import { IconBox } from '../IconBox';
import { IconBoxProps } from '../ButtonIcon/inde';
import { SizeProps } from '../IconBox/styles';

interface Props {
    label: string
    description: string
    size?: SizeProps 
    icon: IconBoxProps
}


export function LocationInfo({ label, description, icon, size = 'NORMAL' }: Props) {
  return (
    <Container>
        <IconBox 
            icon={icon}
            size={size}
        />

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