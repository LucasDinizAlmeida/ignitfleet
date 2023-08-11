import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  flex: 1;
  max-height: 56px;
  min-height: 56px;

  background-color: ${({ theme }) => theme.COLORS.BRAND_MID};

  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
    color: ${({ theme }) => theme.COLORS.WHITE};
    font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
    font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
    text-align: center;
`

export const LoadIndicator = styled.ActivityIndicator.attrs(({ theme }) => ({
    color: theme.COLORS.WHITE
  }))``