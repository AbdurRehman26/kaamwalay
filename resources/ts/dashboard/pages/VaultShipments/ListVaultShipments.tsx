import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useListVaultShipmentsQuery } from '@shared/redux/hooks/useVaultShipmentsQuery';
import { ListHeader } from '@dashboard/components/ListHeader/ListHeader';
import { VaultShipmentsTable } from '@dashboard/components/VaultShipmentsTable';

const useStyles = makeStyles(
    (theme) => ({
        newShipmentBtn: {
            borderRadius: 24,
            padding: '12px 24px',
            [theme.breakpoints.down('sm')]: {
                marginLeft: 'auto',
                padding: '9px 16px',
            },
        },
    }),
    {
        name: 'ListVaultShipmentsPage',
    },
);

export function ListVaultShipments() {
    const classes = useStyles();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const vaultShipments$ = useListVaultShipmentsQuery({
        params: {
            filter: { search: search },
        },
        ...bracketParams(),
    });

    const redirectToNewShipment = useCallback(() => {
        navigate('/cards');
    }, [navigate]);

    function handleOnClick() {
        redirectToNewShipment();
    }

    const $newShipment = (
        <Button onClick={handleOnClick} variant={'contained'} color={'primary'} className={classes.newShipmentBtn}>
            New Shipment
        </Button>
    );

    return (
        <>
            <ListHeader
                headline={'Vault Shipments'}
                noMargin
                onSearch={setSearch}
                actions={isMobile ? $newShipment : null}
                noSearch={vaultShipments$.data.length === 0 && search === ''}
            >
                {!isMobile ? $newShipment : null}
            </ListHeader>
            <VaultShipmentsTable search={search} />
        </>
    );
}
