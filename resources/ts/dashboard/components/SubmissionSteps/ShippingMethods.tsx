import InfoIcon from '@mui/icons-material/InfoOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { instanceToPlain } from 'class-transformer';
import React, { ReactNode, useCallback } from 'react';
import { useQuery } from 'react-query';
import { ShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { useRepository } from '@shared/hooks/useRepository';
import { ShippingMethodsRepository } from '@shared/repositories/ShippingMethodsRepository';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { initializeShippingMethod, setIsNextDisabled, setShippingMethod } from '../../redux/slices/newSubmissionSlice';
import { InsuredShippingMethod } from './InsuredShippingMethod';
import { ShippingMethod } from './ShippingMethod';
import { VaultStorageMethod } from './VaultStorageMethod';

const mappedContent: Record<string, ReactNode> = {
    // eslint-disable-next-line camelcase
    insured_shipping: <InsuredShippingMethod />,
    // eslint-disable-next-line camelcase
    vault_storage: <VaultStorageMethod />,
};

export function ShippingMethods() {
    const dispatch = useAppDispatch();
    const shippingMethod = useAppSelector((state) => state.newSubmission.shippingMethod);
    const shippingMethodsRepository = useRepository(ShippingMethodsRepository);
    const shippingMethods = useQuery('checkout/shippingMethods', () => shippingMethodsRepository.listAll(), {
        onSuccess(data) {
            dispatch(initializeShippingMethod(instanceToPlain(data[0]) as ShippingMethodEntity));
        },
    });

    const handleSelectMethod = useCallback(
        (method: ShippingMethodEntity) => {
            dispatch(setIsNextDisabled(false));
            dispatch(setShippingMethod(instanceToPlain(method) as ShippingMethodEntity));
        },
        [dispatch],
    );

    if (shippingMethods.isLoading) {
        return (
            <Grid container justifyContent={'center'} p={5}>
                <CircularProgress size={24} />
            </Grid>
        );
    }

    return (
        <Stack>
            <Grid container direction={'row'} alignItems={'center'} py={3}>
                <Typography variant={'subtitle1'} fontWeight={500} mr={1}>
                    Insured Shipping or Vault Storage?
                </Typography>
                <Tooltip
                    title={
                        <Stack>
                            <Typography variant={'caption'} mb={2}>
                                Please tell us if you would like to have your cards shipped back to you once they are
                                graded (Insured Shipping) or would you like to store your cards in the AGS Vault?
                            </Typography>

                            <Typography variant={'caption'} fontWeight={700}>
                                What is Vault Storage?
                            </Typography>
                            <Typography variant={'caption'} mb={2}>
                                Vault storage allows you to safely store your cards in our AGS vault. Rather than
                                shipping it back after grading, we will store your slabbed card in a level-8 security
                                safe.
                            </Typography>

                            <Typography variant={'caption'} mb={2}>
                                You can opt to have your card shipped to you at any point.
                            </Typography>

                            <Typography variant={'caption'}>Vault storage is completely FREE.</Typography>
                        </Stack>
                    }
                >
                    <InfoIcon />
                </Tooltip>
            </Grid>
            <Grid container spacing={3} mb={4}>
                {shippingMethods.data?.map((method) =>
                    mappedContent[method.code] ? (
                        <Grid item xs={6} key={method.id}>
                            <ShippingMethod
                                selected={method.id === shippingMethod?.id}
                                shippingMethod={method}
                                onSelect={handleSelectMethod}
                            />
                        </Grid>
                    ) : null,
                )}
            </Grid>

            {shippingMethod?.code && mappedContent[shippingMethod?.code] ? mappedContent[shippingMethod?.code] : null}
        </Stack>
    );
}
