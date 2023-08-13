import React, { ReactNode } from 'react';
import { Container } from './styles';
import { TouchableOpacityProps } from 'react-native';
import { IconProps } from 'phosphor-react-native';
import { useTheme } from 'styled-components';

type IconBoxProps = (Props: IconProps) => JSX.Element

interface Props extends TouchableOpacityProps {
    icon: IconBoxProps
}

export function ButtonIcon({ icon: Icon, ...rest }: Props) {

    const theme = useTheme()

  return (
    <Container {...rest}>
        <Icon 
            size={24}
            color={theme.COLORS.BRAND_MID}
        />
    </Container>
  );
}