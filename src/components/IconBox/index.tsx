import React from 'react';
import { Container, SizeProps } from './styles';
import { IconBoxProps } from '../ButtonIcon/inde';
import { useTheme } from 'styled-components';

interface Props {
    size: SizeProps
    icon: IconBoxProps
}

export function IconBox({ size, icon: Icon }: Props) {

    const theme = useTheme()
    const iconSize = size === 'NORMAL'? 24 : 16

  return (
    <Container size={size}>
        <Icon 
            color={theme.COLORS.BRAND_LIGHT}
            size={iconSize}
        />
    </Container>
  );
}