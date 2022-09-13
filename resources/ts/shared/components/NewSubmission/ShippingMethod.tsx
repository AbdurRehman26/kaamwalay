import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ButtonBase from '@mui/material/ButtonBase';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { ReactNode, useCallback } from 'react';
import { SafeSquare } from '@shared/components/icons/SafeSquare';
import { ShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { cx } from '@shared/lib/utils/cx';

interface Props {
    shippingMethod: ShippingMethodEntity;
    selected: boolean;
    onSelect(shippingMethod: ShippingMethodEntity): void;
}

const mappedIcons: Record<string, ReactNode> = {
    // eslint-disable-next-line camelcase
    insured_shipping: <LocalShippingIcon />,
    // eslint-disable-next-line camelcase
    vault_storage: <SafeSquare />,
};

export function ShippingMethod({ shippingMethod, onSelect, selected }: Props) {
    const handleClick = useCallback(() => onSelect(shippingMethod), [onSelect, shippingMethod]);

    return (
        <Root onClick={handleClick} className={cx({ selected })}>
            <Radio checked={selected} />
            {mappedIcons[shippingMethod.code] || <LocalShippingIcon />}
            <Typography ml={1} variant={'subtitle1'} fontWeight={500} color={selected ? 'primary' : 'textPrimary'}>
                {shippingMethod.name}
            </Typography>
        </Root>
    );
}

const Root = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start !important',
    width: '100%',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 2,
    padding: theme.spacing(1),
    '.MuiSvgIcon-root': {
        color: theme.palette.text.secondary,
    },
    '&.selected': {
        '.MuiSvgIcon-root': {
            color: theme.palette.primary.main,
        },
    },
}));
