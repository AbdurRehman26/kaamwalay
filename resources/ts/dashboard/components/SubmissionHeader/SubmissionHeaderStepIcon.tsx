import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import StyleIcon from '@mui/icons-material/Style';
import Grid from '@mui/material/Grid';
import { StepIconProps } from '@mui/material/StepIcon';
import { styled, useTheme } from '@mui/material/styles';
import clsx from 'clsx';
import React, { useMemo } from 'react';

const Root = styled(Grid)(({ theme }) => ({
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    border: `2px solid ${theme.palette.primary.main}`,
    '&.completed': {
        backgroundColor: theme.palette.primary.main,
    },
}));

export function SubmissionHeaderStepIcon({ active, completed, icon }: StepIconProps) {
    const theme = useTheme();

    const icon$ = useMemo(() => {
        const color = completed ? theme.palette.primary.contrastText : theme.palette.primary.main;

        switch (icon) {
            case 1:
                return <LeaderboardIcon htmlColor={color} />;
            case 2:
                return <StyleIcon htmlColor={color} />;
            case 3:
                return <LocalShippingOutlinedIcon htmlColor={color} />;
            case 4:
                return <PaymentOutlinedIcon htmlColor={color} />;
            case 5:
                return <ReceiptOutlinedIcon htmlColor={color} />;
        }
    }, [completed, icon, theme.palette.primary.contrastText, theme.palette.primary.main]);

    return (
        <Root container alignItems={'center'} justifyContent={'center'} className={clsx({ active, completed })}>
            {icon$}
        </Root>
    );
}
