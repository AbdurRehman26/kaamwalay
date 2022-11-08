import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';

interface SalesRepOverviewCardProps {
    title: string;
    value: string;
    hint?: string;
}

const useStyles = makeStyles(
    {
        cardWrapper: {},
        cardContent: {
            border: '1px solid #E0E0E0',
            background: '#FFFFFF',
            borderRadius: '4px',
            padding: 20,
            height: '124px',
            width: '100%',
        },
        cardTitle: {
            fontSize: '14px',
            fontWeight: 400,
            color: '#0000008A',
        },
        cardValue: { fontSize: '36px' },
    },
    { name: 'SalesRepOverviewCard' },
);

export function SalesRepOverviewCard({ title, value, hint = '' }: SalesRepOverviewCardProps) {
    const classes = useStyles();

    return (
        <Grid item className={classes.cardContent}>
            <Grid container item justifyContent={'space-between'} alignItems={'center'}>
                <Box display={'flex'} alignItems={'center'}>
                    <Typography className={classes.cardTitle}>{title}</Typography>
                    {hint?.length > 0 ? (
                        <Tooltip
                            enterTouchDelay={0}
                            leaveTouchDelay={5000}
                            title={
                                <Box>
                                    <Typography display={'block'} variant={'caption'}>
                                        {hint}
                                    </Typography>
                                </Box>
                            }
                        >
                            <IconButton aria-label="info" sx={{ padding: '0 0 0 10px' }}>
                                <InfoOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    ) : null}
                </Box>
            </Grid>
            <Grid display={'flex'} mt={2} alignItems={'center'}>
                <Grid>
                    <Typography variant={'h4'} className={classes.cardValue}>
                        {formatCurrency(value || 0)}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}
