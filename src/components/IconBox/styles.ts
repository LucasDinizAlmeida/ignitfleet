import styled, { css } from 'styled-components/native';

export type SizeProps = 'NORMAL' | 'SMALL'

const variantSizeStyles = (size: SizeProps) => {
    return {
        SMALL: css`
            width: 32px;
            height: 32px;
        `,
        NORMAL: css`
            width: 46px;
            height: 46px;
        `
    }[size]
}

interface Props {
    size: SizeProps
}


export const Container = styled.View<Props>`
    border-radius: 6px;
    background-color: ${({ theme }) => theme.COLORS.GRAY_700};
    align-items: center;
    justify-content: center;

    margin-right: 12px;

    ${({ size }) => variantSizeStyles(size)}
`;