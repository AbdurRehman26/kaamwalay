import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React from 'react';
import { font } from '@shared/styles/utils';

const Root = styled('div')(
    ({ theme }) => ({
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: theme.spacing(4),
        padding: theme.spacing(4),
    }),
    { name: 'StyledRoot' },
);
/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: GradePendingMessage
 * @date: 10.08.2021
 * @time: 17:22
 */
export function GradePendingMessage() {
    return (
        <Root>
            <Typography variant={'h6'} align={'center'} className={font.fontWeightMedium}>
                Grade Pending
            </Typography>
            <Typography variant={'caption'} align={'center'}>
                This card has not been graded yet.
            </Typography>
        </Root>
    );
}

export default GradePendingMessage;
