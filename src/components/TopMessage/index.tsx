import React from 'react';
import { Container, Title } from './styles';
import { IconBoxProps } from '../ButtonIcon/inde';
import { useTheme } from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    icon?: IconBoxProps
    title: string
}

export function TopMessage({ title, icon: Icon}: Props) {

    const theme = useTheme()
    const inserts = useSafeAreaInsets()
    const paddingTop = inserts.top + 5

  return (
    <Container style={{ paddingTop }}>
        {
            Icon &&
            <Icon 
                color={theme.COLORS.GRAY_100}
            />
        }

        <Title>
            {title}
        </Title>
    </Container>
  );
}