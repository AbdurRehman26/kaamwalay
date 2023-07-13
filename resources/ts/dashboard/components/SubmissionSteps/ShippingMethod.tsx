import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { ReactNode, useCallback } from 'react';
import { SafeSquare } from '@shared/components/icons/SafeSquare';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { ShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { cx } from '@shared/lib/utils/cx';
import SubmissionShippingDetailDialog from '@dashboard/pages/Submissions/ViewSubmission/SubmissionShippingDetailDialog';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import {
    getShippingFee,
    setDialog,
    setHasShippingInsurance,
    setShippingInsuranceFee,
} from '@dashboard/redux/slices/newSubmissionSlice';

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

const mappedDescriptions: Record<string, ReactNode> = {
    // eslint-disable-next-line camelcase
    insured_shipping: "We'll ship your cards back to you.",
    // eslint-disable-next-line camelcase
    vault_storage: "We'll storage your cards in AGS Vault.",
};
export function ShippingMethod({ shippingMethod, onSelect, selected }: Props) {
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const dispatch = useAppDispatch();

    const handleClick = useCallback(() => {
        onSelect(shippingMethod);
        if (shippingMethod.code === ShippingMethodType.VaultStorage) {
            dispatch(getShippingFee(selectedCards));
            dispatch(setHasShippingInsurance(false));
            dispatch(setShippingInsuranceFee(0));
        } else if (shippingMethod.code === ShippingMethodType.InsuredShipping) {
            dispatch(setHasShippingInsurance(true));
        }
    }, [shippingMethod, onSelect, dispatch, selectedCards]);

    const handleDialog = useCallback(() => {
        dispatch(setDialog(true));
    }, [dispatch]);

    return (
        <Grid container>
            <Root onClick={handleClick} className={cx({ selected })}>
                <Radio className={'radioButton'} checked={selected} />
                <Grid container display={'flex'} flexDirection={'column'}>
                    <Grid item container>
                        <Typography mx={1} variant={'subtitle1'} fontWeight={500} fontSize={14} color={'textPrimary'}>
                            {shippingMethod.name}
                        </Typography>
                        <Grid item className={'methodIcon'}>
                            {mappedIcons[shippingMethod.code] || <LocalShippingIcon />}
                        </Grid>
                    </Grid>
                    <Grid item container>
                        <Typography
                            ml={1}
                            variant={'subtitle1'}
                            fontWeight={400}
                            fontSize={12}
                            className={'description'}
                        >
                            {mappedDescriptions[shippingMethod.code]}
                        </Typography>
                    </Grid>
                </Grid>
            </Root>
            {shippingMethod.code === 'vault_storage' ? (
                <>
                    <Typography
                        fontSize={12}
                        fontWeight={400}
                        lineHeight={'20px'}
                        letterSpacing={'0.2px'}
                        color={'#0000008A'}
                        mt={1}
                        style={{ textDecoration: 'underline' }}
                        onClick={handleDialog}
                    >
                        What is vault storage?
                    </Typography>
                    <SubmissionShippingDetailDialog shippingMethod={shippingMethod} paid={false} />
                </>
            ) : null}
        </Grid>
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
    '.description': {
        color: theme.palette.text.secondary,
    },
    '.methodIcon': {
        maxWidth: '20px',
        '.MuiSvgIcon-root': {
            width: '100%',
        },
    },
    '&.selected': {
        border: '2px solid ' + theme.palette.primary.main,
        '.radioButton': {
            '.MuiSvgIcon-root': {
                color: theme.palette.primary.main,
            },
        },
    },
}));
