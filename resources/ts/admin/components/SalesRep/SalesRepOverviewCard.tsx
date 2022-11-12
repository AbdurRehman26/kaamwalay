import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { app } from '@shared/lib/app';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { APIService } from '@shared/services/APIService';
import { FilterSelect } from '@admin/components/SalesRep/FilterSelect';
import { useAppDispatch } from '@admin/redux/hooks';

interface SalesRepOverviewCardProps {
    title: string;
    value?: number;
    hint?: string;
    timeFilters?: boolean;
    statName?: string;
}

const TimeFilters = [
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'This Year', value: 'this_year' },
    { label: 'Last Year', value: 'last_year' },
    { label: 'Custom Date Range', value: 'custom' },
];
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
        cardActionsWrapper: {
            height: '28px',
        },
        cardValue: { fontSize: '36px' },
    },
    { name: 'SalesRepOverviewCard' },
);

export function SalesRepOverviewCard({
    title,
    value = 0,
    hint = '',
    timeFilters = false,
    statName = '',
}: SalesRepOverviewCardProps) {
    const classes = useStyles();
    const [timeFilter, setTimeFilter] = useState({ label: 'This Month', value: 'this_month' });
    const dispatch = useAppDispatch();
    const { id } = useParams<'id'>();
    const [cardValue, setCardValue] = useState(value);
    const apiService = app(APIService);

    useEffect(() => {
        if (statName && timeFilter) {
            const endpoint = apiService.createEndpoint(`admin/salesman/${id}/get-stat`);
            endpoint
                .post('', {
                    statName,
                    timeFilter: timeFilter.value,
                })
                .then((response) => {
                    setCardValue(response.data);
                });
        }
    }, [apiService, dispatch, id, statName, timeFilter]);

    return (
        <Grid item container className={classes.cardContent} direction={'row'}>
            <Grid item container md={6}>
                <Grid container item alignItems={'center'}>
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
                </Grid>
                <Grid display={'flex'} mt={2} alignItems={'center'}>
                    <Grid>
                        <Typography variant={'h4'} className={classes.cardValue}>
                            {formatCurrency(cardValue || 0)}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container item xs>
                <Grid container item xs className={classes.cardActionsWrapper} justifyContent={'flex-end'}>
                    {timeFilters ? (
                        <FilterSelect value={timeFilter.label}>
                            {TimeFilters?.map((item: any) => {
                                return (
                                    <MenuItem
                                        onClick={() => setTimeFilter({ label: item.label, value: item.value })}
                                        key={item.value}
                                        value={item.label}
                                        sx={{ paddingLeft: 0, paddingRight: 0 }}
                                    >
                                        <Radio
                                            checked={timeFilter.value === item.value}
                                            value={timeFilter.value}
                                            name={timeFilter.value}
                                        />
                                        {item.label}
                                    </MenuItem>
                                );
                            })}
                        </FilterSelect>
                    ) : null}
                    {/* <AddIcon onClick={handleCreditDialog} sx={{ cursor: 'pointer' }} />*/}
                </Grid>
            </Grid>
        </Grid>
    );
}
