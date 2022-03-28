import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import React, { MouseEventHandler, useCallback, useState } from 'react';
import { ColoredStatusChip } from '@shared/components/ColoredStatusChip';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { useConfirmation } from '@shared/hooks/useConfirmation';
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

export function PromoCodesTableRow({ promoCode }: PromoCodesTableRowProps) {
    const dispatch = useSharedDispatch();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const confirm = useConfirmation();

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
            let confirmation = false;

            switch (option) {
                case Options.Deactivate:
                    confirmation = await confirm({
                        title: 'Deactivate Promo Code',
                        message: 'Are you sure you want to deactivate this promo code?',
                        confirmText: 'Deactivate',
                        confirmButtonProps: {
                            variant: 'contained',
                        },
                    });
                    if (confirmation) {
                        dispatch(changePromoCodeStatus({ promoCodeID: promoCode?.id, newStatus: 3 }));
                    }
                    break;
                case Options.Reactivate:
                    dispatch(changePromoCodeStatus({ promoCodeID: promoCode?.id, newStatus: 2 }));
                    break;
                case Options.Delete:
                    confirmation = await confirm({
                        title: 'Are you sure you want to delete promo code?',
                        message: 'Delete Promo Code',
                        confirmText: 'Delete',
                        confirmButtonProps: {
                            variant: 'contained',
                        },
                    });
                    if (confirmation) {
                        dispatch(deletePromoCode({ promoCodeID: promoCode?.id }));
                    }
                    break;
            }
        },
        [confirm, dispatch, handleCloseOptions, promoCode?.id],
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
