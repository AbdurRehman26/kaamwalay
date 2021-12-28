import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import React, { MouseEventHandler, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useNotifications } from '@shared/hooks/useNotifications';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { ColoredStatusChip } from '@shared/components/ColoredStatusChip';
import { useConfirm } from 'material-ui-confirm';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { changePromoCodeStatus, deletePromoCode } from '@shared/redux/slices/adminPromoCodesSlice';

interface PromoCodesTableRowProps {
    promoCode: PromoCodeEntity;
    reloadCallback: any;
}

enum Options {
    Reactivate,
    Delete,
    Deactivate,
}

const useStyles = makeStyles(
    (theme) => ({
        optionsCell: {
            width: theme.spacing(6),
            paddingLeft: 0,
        },
    }),
    { name: 'PromoCodesTableRow' },
);

export function PromoCodesTableRow({ promoCode, reloadCallback }: PromoCodesTableRowProps) {
    const notifications = useNotifications();
    const dispatch = useSharedDispatch();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const history = useHistory();
    const confirm = useConfirm();

    const getStatusChipDataMap = (statusCode: string) => {
        if (statusCode === 'active') {
            return {
                label: 'Active',
                color: '#EB8E21',
                textColor: '#fff',
            };
        }

        if (statusCode === 'inactive') {
            return {
                label: 'Inactive',
                color: '#E1E1E1',
                textColor: '#000',
            };
        }

        if (statusCode === 'queued') {
            return {
                label: 'Queued',
                color: '#AB47BC',
                textColor: '#fff',
            };
        }

        if (statusCode === 'expired') {
            return {
                label: 'Expired',
                color: '#000',
                textColor: '#fff',
            };
        }

        return {
            label: '',
            color: '#000',
        };
    };

    const handleOption = useCallback(
        (option: Options) => async () => {
            handleCloseOptions();

            switch (option) {
                case Options.Deactivate:
                    confirm({
                        title: 'Deactivate Promo Code',
                        description: 'Are you sure you want to deactivate this promo code?',
                        confirmationText: 'Deactivate',
                        confirmationButtonProps: {
                            variant: 'contained',
                        },
                    })
                        .then(async (r) => {
                            dispatch(changePromoCodeStatus({ promoCodeID: promoCode?.id, newStatus: 3 }));
                        })
                        .catch((err) => {
                            console.log('Rejected');
                        });
                    break;
                case Options.Reactivate:
                    dispatch(changePromoCodeStatus({ promoCodeID: promoCode?.id, newStatus: 2 }));
                    break;
                case Options.Delete:
                    confirm({
                        title: 'Delete Promo Code',
                        description: 'Are you sure you want to delete promo code?',
                        confirmationText: 'Delete',
                        confirmationButtonProps: {
                            variant: 'contained',
                        },
                    })
                        .then(async (r) => {
                            dispatch(deletePromoCode({ promoCodeID: promoCode?.id }));
                        })
                        .catch((err) => {
                            console.log('Rejected');
                        });
                    break;
            }
        },
        [handleCloseOptions, history, notifications, promoCode?.id, promoCode?.status],
    );
    return (
        <TableRow>
            <TableCell align={'left'} sx={{ fontWeight: 'bold' }}>
                {promoCode?.code}
            </TableCell>
            <TableCell align={'left'}>
                {promoCode?.type === 'percentage' ? `${promoCode?.discountValue}%` : `$${promoCode?.discountValue}`}
            </TableCell>
            <TableCell align={'left'}>{promoCode?.couponApplicable.label}</TableCell>
            <TableCell align={'left'}>
                {promoCode?.isPermanent ? 'Permanent' : `${promoCode?.availableFrom} - ${promoCode?.availableTill}`}
            </TableCell>
            <TableCell>
                <ColoredStatusChip
                    label={getStatusChipDataMap(promoCode?.couponStatus.code).label}
                    color={getStatusChipDataMap(promoCode?.couponStatus.code).color}
                    textColor={getStatusChipDataMap(promoCode?.couponStatus.code).textColor}
                />
            </TableCell>
            <TableCell align={'left'}>{promoCode?.couponStats.timesUsed}</TableCell>
            <TableCell align={'left'}>${promoCode?.couponStats.totalDiscount}</TableCell>
            <TableCell align={'right'} className={classes.optionsCell}>
                <IconButton onClick={handleClickOptions} size="large">
                    <MoreIcon />
                </IconButton>

                <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                    {promoCode?.couponStatus.code === 'active' ? (
                        <MenuItem onClick={handleOption(Options.Deactivate)}>Deactivate</MenuItem>
                    ) : null}
                    {promoCode?.couponStatus.code === 'inactive' ? (
                        <MenuItem onClick={handleOption(Options.Reactivate)}>Reactivate</MenuItem>
                    ) : null}
                    <MenuItem onClick={handleOption(Options.Delete)}>Delete</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
}

export default PromoCodesTableRow;
