import React from 'react';
import { Container, LoadIndicator, Title } from './styles';
import { TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
    title: string
    isLoading?: boolean
}

export function Button({ title, isLoading = false, ...rest }: Props) {
  return (
    <Container
        activeOpacity={0.7}
        disabled={isLoading}
        {...rest}
    >
        {
            isLoading?
            <LoadIndicator />
            :
            <Title>
                {title}
            </Title>
        }
    </Container>
  );
}