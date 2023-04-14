import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import React, { ForwardedRef, forwardRef } from 'react';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import ManageCardDialogCreateCategoryContent from './ManageCardDialogCreateCategoryContent';
import ManageCardDialogHeader from './ManageCardDialogHeader';

export interface ManageCardDialogCreateCategoryViewProps {
    isSwappable?: boolean;
    declaredValue?: number;
    onCancel?: () => void;

    onAdd(data: { declaredValue: number; card: CardProductEntity; orderItemId?: number | null }): Promise<void> | void;
}
const useStyles = makeStyles(
    (theme) => ({
        root: {},
        topDivider: {
            marginTop: theme.spacing(2),
        },
        swapButton: {
            marginTop: 19,
            height: 38,
        },
        validationStyle: {
            color: '#0000008A',
            fontSize: '12px',
            fontWeight: '400',
            marginTop: '4px',
        },
    }),
    { name: 'ManageCardDialogView' },
);

export const ManageCardDialogCreateCategoryView = forwardRef(
    (
        { onAdd, isSwappable, declaredValue = 0 }: ManageCardDialogCreateCategoryViewProps,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        const classes = useStyles();
        return (
            <div ref={ref}>
                <ManageCardDialogHeader back={true} label={'Create a New Category'} />
                <Divider className={classes.topDivider} />
                <ManageCardDialogCreateCategoryContent margin={'12px'} />
            </div>
        );
    },
);

export default ManageCardDialogCreateCategoryView;
