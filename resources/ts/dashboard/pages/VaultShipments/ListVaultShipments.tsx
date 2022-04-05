import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useState } from 'react';
import ReactGA from 'react-ga';
import { useNavigate } from 'react-router-dom';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { googleTagManager } from '@shared/lib/utils/googleTagManager';
import { useListOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
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

    const orders$ = useListOrdersQuery({
        params: {
            filter: { orderNumber: search },
            include: ['paymentPlan', 'invoice', 'orderStatus', 'orderCustomerShipment'],
        },
        ...bracketParams(),
    });

    const redirectToNewShipment = useCallback(() => {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.initiated,
        });
        googleTagManager({ event: 'google-ads-started-submission-process' });

        navigate('/vault-shipments/new');
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
                noSearch={orders$.data.length === 0 && search === ''}
            >
                {!isMobile ? $newShipment : null}
            </ListHeader>
            <VaultShipmentsTable search={search} />
        </>
    );
}
