import InfoIcon from '@mui/icons-material/InfoOutlined';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useCallback, useMemo } from 'react';
import { SelectAddressDialog, SelectAddressFormValues } from '@shared/components/SelectAddressDialog';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { ShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { useDialogHelper } from '@shared/hooks/useDialogHelper';
import { useLoadingModal } from '@shared/hooks/useLoadingModal';
import { useRepository } from '@shared/hooks/useRepository';
import { delay } from '@shared/lib/utils/delay';
import { updateOrderShippingMethod } from '@shared/redux/slices/ordersSlice';
import { OrdersRepository } from '@shared/repositories/OrdersRepository';
import { useAppDispatch } from '../../../redux/hooks';

interface Props {
    orderId?: number;
    shippingMethod?: ShippingMethodEntity;
    paid?: boolean;
}

export function SubmissionShippingMethod({ orderId, shippingMethod, paid }: Props) {
    const orderRepository = useRepository(OrdersRepository);
    const selectAddress = useDialogHelper();
    const loadingModal = useLoadingModal();

    const dispatch = useAppDispatch();

    const handleSelectAddress = useCallback(
        async ({ address, newAddress }: SelectAddressFormValues) => {
            if (orderId) {
                selectAddress.close();
                loadingModal.open({
                    state: 'loading',
                    message: 'Switching to Insured Shipping...',
                });

                try {
                    const { shippingMethod, shippingAddress } = await orderRepository.attachShippingAddress({
                        address,
                        orderId,
                        saveForLater: !!newAddress,
                        shippingMethod: ShippingMethodType.InsuredShippingID,
                    });

                    dispatch(updateOrderShippingMethod({ orderId, shippingMethod, shippingAddress }));

                    loadingModal.setData({
                        state: 'loaded',
                        message: 'Successfully switched to Insured Shipping.',
                    });
                    await delay(2000);
                } catch (e) {
                    loadingModal.setData({
                        state: 'error',
                        message: (e as Error).message,
                    });
                    await delay(3000);
                } finally {
                    loadingModal.close();
                }
            }
        },
        [dispatch, loadingModal, orderId, orderRepository, selectAddress],
    );

    const handleSwitchToVault = useCallback(async () => {
        if (orderId) {
            loadingModal.open({
                state: 'loading',
                message: 'Switching to Insured Shipping...',
            });
            try {
                const { shippingMethod, shippingAddress } = await orderRepository.attachShippingAddress({
                    orderId,
                    shippingMethod: ShippingMethodType.VaultStorageID,
                });

                dispatch(updateOrderShippingMethod({ orderId, shippingMethod, shippingAddress }));

                loadingModal.setData({
                    state: 'loaded',
                    message: 'Successfully switched to Vault Storage.',
                });
                await delay(2000);
            } catch (e) {
                loadingModal.setData({
                    state: 'error',
                    message: (e as Error).message,
                });
                await delay(3000);
            } finally {
                loadingModal.close();
            }
        }
    }, [dispatch, loadingModal, orderId, orderRepository]);

    const content = useMemo(() => {
        if (shippingMethod?.code === ShippingMethodType.InsuredShipping) {
            return (
                <>
                    <Typography variant={'caption'} mb={2} maxWidth={480}>
                        You have opted to have your slabbed cards shipped back to you.
                    </Typography>
                    {!paid ? (
                        <Button variant={'outlined'} color={'primary'} onClick={handleSwitchToVault}>
                            Switch to Vault Storage
                        </Button>
                    ) : null}
                </>
            );
        }

        return (
            <>
                <Typography variant={'caption'} mb={2} maxWidth={480}>
                    {paid ? (
                        <>
                            You have opted to store your cards in the AGS Vault, which means they will be stored in a
                            secure safe within the AGS Card Vault.
                        </>
                    ) : (
                        <>
                            You have opted to store your cards in the AGS Vault, which means they will be stored in a
                            secure safe within the AGS Card Vault. You can switch to standard insured shipping at any
                            point by clicking the button below.
                        </>
                    )}
                </Typography>
                {!paid ? (
                    <>
                        <Button variant={'outlined'} color={'primary'} {...selectAddress.buttonProps}>
                            Switch to Insured Shipping
                        </Button>
                        <SelectAddressDialog onSubmit={handleSelectAddress} {...selectAddress.dialogProps} />
                    </>
                ) : null}
            </>
        );
    }, [
        paid,
        handleSelectAddress,
        handleSwitchToVault,
        selectAddress.buttonProps,
        selectAddress.dialogProps,
        shippingMethod?.code,
    ]);

    if (!orderId) {
        return null;
    }

    return (
        <>
            <Divider sx={{ mt: 3 }} />
            <Stack py={4} alignItems={'flex-start'}>
                <Typography variant={'body1'} fontWeight={500}>
                    Shipping/Storage Selection
                </Typography>
                <Grid container alignItems={'center'}>
                    <Typography variant={'h6'} color={'primary'} fontWeight={500}>
                        {shippingMethod?.name ?? 'Insured Shipping'}
                    </Typography>
                    {paid && shippingMethod?.code === ShippingMethodType.VaultStorage ? (
                        <Tooltip
                            title={
                                <Stack>
                                    <Typography variant={'caption'} mb={2.5}>
                                        Since you have already paid, you cannot switch from Vault Storage to Insured
                                        Shipping from the submission page.
                                    </Typography>
                                    <Typography variant={'caption'}>
                                        If you want your cards shipped back to you, you will have to wait till this
                                        submission is <b>Stored in Vault</b>, then go to Your Cards to create a
                                        shipment.
                                    </Typography>
                                </Stack>
                            }
                        >
                            <InfoIcon color={'disabled'} sx={{ ml: 1 }} />
                        </Tooltip>
                    ) : null}
                </Grid>
                {content}
            </Stack>
        </>
    );
}
