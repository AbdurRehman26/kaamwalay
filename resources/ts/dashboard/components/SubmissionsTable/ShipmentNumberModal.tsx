import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';

type ShipmentNumberModalProps = {
    id: string | number;
    showModal: boolean;
    customerShipment: any;
    handleModalVisibility: any;
};

const shipmentProviders = [
    {
        viewValue: 'United States Postal Service (USPS)',
        value: 'usps',
    },
    {
        viewValue: 'UPS',
        value: 'ups',
    },
    {
        viewValue: 'FedEx',
        value: 'fedex',
    },
    {
        viewValue: 'DHL Express',
        value: 'dhlexpress',
    },
];

const useStyles = makeStyles(
    (theme: Theme) =>
        createStyles({
            formControl: {
                minWidth: '100%',
                marginBottom: '24px',
            },
            dialogActions: {
                marginBottom: '12px',
                marginRight: '24px',
            },
            contentContainer: {
                width: '457px',
            },
            saveBtn: {
                width: '140px',
                height: '48px',
                marginLeft: '12px',
            },
            fieldContainer: {
                display: 'flex',
                alignItems: 'start',
                flexDirection: 'column',
            },
            selectEmpty: {
                marginTop: theme.spacing(2),
            },
            label: {
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0.2px',
                color: 'rgba(0, 0, 0, 0.87)',
                marginBottom: '12px',
            },
            shipmentSelect: {
                height: '40px',
                width: '100%',
                marginBottom: '24px',
            },
        }),
    { name: 'ShipmentNumberModal' },
);

function ShipmentNumberModal(props: ShipmentNumberModalProps) {
    const classes = useStyles();
    const { id, showModal, customerShipment, handleModalVisibility } = props;
    const [selectedShipmentProvider, setSelectedShipmentProvider] = useState(
        customerShipment === null
            ? shipmentProviders[0].value
            : shipmentProviders.some((item) => item.value === customerShipment?.shipping_provider)
            ? customerShipment.shipping_provider
            : 'other',
    );
    const [customShipmentProvider, setCustomShipmentProvider] = useState(customerShipment?.shipping_provider ?? '');
    const [trackingNumber, setTrackingNumber] = useState(customerShipment?.tracking_number ?? '');
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const apiService = useInjectable(APIService);

    async function handleSubmitPress() {
        const endpoint = apiService.createEndpoint(`customer/orders/${id}/customer-shipment`);
        try {
            await endpoint.post('', {
                shipping_provider:
                    selectedShipmentProvider === 'other' ? customShipmentProvider : selectedShipmentProvider,
                tracking_number: trackingNumber,
            });
            handleModalVisibility();
        } catch (err) {}
    }

    function handleCustomShipmentProviderChange(e: any) {
        setCustomShipmentProvider(e.target.value);
    }

    function handleShipmentProviderChange(e: any) {
        if (e.target.value === 'other') {
            setCustomShipmentProvider('');
        }
        setSelectedShipmentProvider(e.target.value);
    }

    function handleTrackingNumberChange(e: any) {
        setTrackingNumber(e.target.value);
    }

    useEffect(() => {
        if (selectedShipmentProvider === 'other') {
            if (trackingNumber.length > 0 && customShipmentProvider.length > 0) {
                setIsSaveEnabled(true);
            } else {
                setIsSaveEnabled(false);
            }
        }

        if (selectedShipmentProvider !== 'other') {
            if (trackingNumber.length > 0) {
                setIsSaveEnabled(true);
            } else {
                setIsSaveEnabled(false);
            }
        }
    }, [customShipmentProvider, trackingNumber, selectedShipmentProvider]);

    return (
        <Dialog open={showModal} onClose={handleModalVisibility}>
            <DialogTitle>{`${customerShipment === null ? 'Add' : 'Edit'} Tracking number`}</DialogTitle>
            <DialogContent className={classes.contentContainer}>
                <div className={classes.fieldContainer}>
                    <Typography className={classes.label}>Shipment Provider</Typography>
                    <Select
                        native
                        variant="outlined"
                        value={selectedShipmentProvider}
                        className={classes.shipmentSelect}
                        onChange={handleShipmentProviderChange}
                    >
                        {shipmentProviders.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.viewValue}
                            </option>
                        ))}
                        <option value={'other'}>Other</option>
                    </Select>
                </div>

                {selectedShipmentProvider === 'other' ? (
                    <div className={classes.fieldContainer}>
                        <Typography className={classes.label}>Shipment Provider</Typography>
                        <TextField
                            label=""
                            value={customShipmentProvider}
                            onChange={handleCustomShipmentProviderChange}
                            inputProps={{ maxLength: 50 }}
                            className={classes.formControl}
                            variant={'outlined'}
                            size={'small'}
                        />
                    </div>
                ) : null}
                <div className={classes.fieldContainer}>
                    <Typography className={classes.label}>Tracking Number</Typography>
                    <TextField
                        label=""
                        value={trackingNumber}
                        onChange={handleTrackingNumberChange}
                        inputProps={{ maxLength: 50 }}
                        className={classes.formControl}
                        variant={'outlined'}
                        size={'small'}
                    />
                </div>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button onClick={handleModalVisibility}>Cancel</Button>
                <Button
                    disabled={!isSaveEnabled}
                    onClick={handleSubmitPress}
                    color="primary"
                    variant={'contained'}
                    className={classes.saveBtn}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ShipmentNumberModal;
