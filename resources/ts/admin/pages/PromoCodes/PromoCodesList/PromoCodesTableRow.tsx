import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useNotifications } from '@shared/hooks/useNotifications';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { PromoCodeStatusEnum } from '@shared/constants/PromoCodeStatusEnum';
import { ColoredStatusChip } from '@shared/components/ColoredStatusChip';
import { useConfirm } from 'material-ui-confirm';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { deactivatePromoCode, deletePromoCode } from '@shared/redux/slices/adminPromoCodesSlice';
import {
    setAvailableServiceLevels,
    setDiscountApplicationType,
    setDiscountDateType,
    setDiscountEndDate,
    setDiscountStartDate,
    setDiscountType,
    setFlatDiscountValue,
    setModalTitle,
    setPercentOffValue,
    setPromoCodeTextValue,
    setSelectedServiceLevels,
    setShowNewPromoCodeDialog,
    toggleSelectedServiceLevel,
} from '@shared/redux/slices/adminNewPromoCodeSlice';
import { DiscountTypeEnums } from '@shared/constants/DiscountTypeEnums';
import { DiscountApplicationEnums } from '@shared/constants/DiscountApplicationEnum';
import { DiscountDateTypeEnum } from '@shared/constants/DiscountDateTypeEnum';

interface PromoCodesTableRowProps {
    promoCode: PromoCodeEntity;
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
    const notifications = useNotifications();
    const dispatch = useSharedDispatch();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const history = useHistory();
    const confirm = useConfirm();

    const statusChipDataMap = useMemo(() => {
        return {
            [PromoCodeStatusEnum.ACTIVE]: {
                label: 'Active',
                color: '#EB8E21',
            },
            [PromoCodeStatusEnum.INACTIVE]: {
                label: 'Inactive',
                color: '#E1E1E1',
            },
            [PromoCodeStatusEnum.QUEUED]: {
                label: 'Queued',
                color: '#AB47BC',
            },
        };
    }, [promoCode?.status]);

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
                        .then((r) => {
                            dispatch(deactivatePromoCode({ promoCodeID: promoCode?.id }));
                        })
                        .catch((err) => {
                            console.log('Rejected');
                        });
                    break;
                case Options.Reactivate:
                    dispatch(setModalTitle('Reactivate Promo Code'));
                    dispatch(setPromoCodeTextValue(promoCode.promoCode));
                    dispatch(setDiscountType(promoCode?.discountType as DiscountTypeEnums));
                    dispatch(setFlatDiscountValue(promoCode?.flatDiscountValue));
                    dispatch(setPercentOffValue(promoCode?.percentOffValue));
                    dispatch(
                        setDiscountApplicationType(promoCode?.discountApplicationType as DiscountApplicationEnums),
                    );
                    dispatch(setAvailableServiceLevels([{ id: 2, value: '60' }]));
                    dispatch(setSelectedServiceLevels(promoCode?.selectedDiscountServiceLevels.map((sl) => sl.id)));
                    dispatch(setDiscountStartDate(promoCode?.discountStartDate));
                    dispatch(setDiscountEndDate(promoCode?.discountEndDate));
                    dispatch(setDiscountDateType(promoCode?.discountDateType as DiscountDateTypeEnum));
                    dispatch(setShowNewPromoCodeDialog(true));
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
                        .then((r) => {
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
                {promoCode?.promoCode}
            </TableCell>
            <TableCell align={'left'}>{promoCode?.discount}</TableCell>
            <TableCell align={'left'}>{promoCode?.appliesTo}</TableCell>
            <TableCell align={'left'}>{promoCode?.date}</TableCell>
            <TableCell>
                <ColoredStatusChip
                    label={statusChipDataMap[promoCode?.status as PromoCodeStatusEnum].label}
                    color={statusChipDataMap[promoCode?.status as PromoCodeStatusEnum].color}
                />
            </TableCell>
            <TableCell align={'left'}>{promoCode?.timesUsed}</TableCell>
            <TableCell align={'left'}>{promoCode?.totalDiscounts}</TableCell>
            <TableCell align={'right'} className={classes.optionsCell}>
                <IconButton onClick={handleClickOptions} size="large">
                    <MoreIcon />
                </IconButton>

                <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                    {promoCode?.status === PromoCodeStatusEnum.ACTIVE ? (
                        <MenuItem onClick={handleOption(Options.Deactivate)}>Deactivate</MenuItem>
                    ) : null}
                    {promoCode?.status === PromoCodeStatusEnum.INACTIVE ? (
                        <MenuItem onClick={handleOption(Options.Reactivate)}>Reactivate</MenuItem>
                    ) : null}
                    <MenuItem onClick={handleOption(Options.Delete)}>Delete</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
}

export default PromoCodesTableRow;
