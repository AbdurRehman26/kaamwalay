import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Form, Formik, FormikProps } from 'formik';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormikButton } from '@shared/components/fields/FormikButton';
import { FormikDesktopDatePicker } from '@shared/components/fields/FormikDesktopDatePicker';
import { TimeFilters } from '@shared/filter/TimeFilter';
import { app } from '@shared/lib/app';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { APIService } from '@shared/services/APIService';
import { FilterSelect } from '@admin/components/SalesRep/FilterSelect';

type InitialValues = {
    startDate: DateLike;
    endDate: DateLike;
};

interface CustomerReferralOverviewCardProps {
    title: string;
    value?: number;
    hint?: string;
    timeFilters?: boolean;
    statName?: string;
    formatAsCurrency?: boolean;
    addButton?: boolean;
    onAddButtonClick?: () => void;
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
        cardActionsWrapper: {
            height: '28px',
        },
        cardValue: { fontSize: '36px' },
    },
    { name: 'SalesRepOverviewCard' },
);

export function CustomerReferralOverviewCard({
    title,
    value = 0,
    hint = '',
    timeFilters = false,
    statName = '',
    formatAsCurrency = true,
    addButton = false,
    onAddButtonClick = () => {},
}: CustomerReferralOverviewCardProps) {
    const classes = useStyles();
    const [timeFilter, setTimeFilter] = useState({ label: 'This Month', value: 'this_month' });
    const { id } = useParams<'id'>();
    const [cardValue, setCardValue] = useState(value);
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const initialValues = useMemo<InitialValues>(
        () => ({
            startDate: startDate ? startDate : '',
            endDate: endDate ? endDate : '',
        }),
        [endDate, startDate],
    );

    const getSalesData = useCallback(
        (values: InitialValues = initialValues) => {
            const apiService = app(APIService);
            const endpoint = apiService.createEndpoint(`admin/customer/${id}/referral/get-referrer-stat`, {
                version: 'v3',
            });
            let statsDTO = {};

            if (statName && timeFilter && timeFilter.value === 'custom') {
                const startDateString = formatDate(values.startDate, 'YYYY-MM-DD');
                const endDateString = formatDate(values.endDate, 'YYYY-MM-DD');

                setStartDate(startDateString ?? '');
                setEndDate(endDateString ?? '');
                statsDTO = {
                    statName,
                    timeFilter: timeFilter.value,
                    startDate: startDateString,
                    endDate: endDateString,
                };
                endpoint.post('', statsDTO).then((response) => {
                    setCardValue(response.data);
                });
            } else if (statName && timeFilter && timeFilter.value !== 'custom') {
                statsDTO = {
                    statName,
                    timeFilter: timeFilter.value,
                };
                endpoint.post('', statsDTO).then((response) => {
                    setCardValue(response.data);
                });
            }
        },
        [initialValues, statName, id, timeFilter],
    );

    useEffect(() => {
        getSalesData();
    }, [getSalesData]);

    const handleSubmit = useCallback(
        async (values) => {
            if (values.startDate && values.endDate) {
                getSalesData(values);
            }
        },
        [getSalesData],
    );

    const getPlainValue = useCallback((value: any) => {
        let value$ = parseInt(`${value || 0}`);
        if (Number.isNaN(value$)) {
            value$ = 0;
        }
        return value$;
    }, []);

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
                            {formatAsCurrency ? formatCurrency(cardValue || 0) : getPlainValue(cardValue || 0)}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container item xs>
                <Grid container item xs className={classes.cardActionsWrapper} justifyContent={'flex-end'}>
                    {timeFilters ? (
                        <FilterSelect
                            fromCustomerReferral={true}
                            value={timeFilter.label}
                            customValueText={
                                timeFilter.value === 'custom' && startDate && endDate ? startDate + ' - ' + endDate : ''
                            }
                        >
                            <>
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

                                {timeFilter.value === 'custom' ? (
                                    <Grid container item xs justifyContent={'space-between'} p={1.5} pl={4}>
                                        <Formik
                                            initialValues={initialValues}
                                            onSubmit={handleSubmit}
                                            innerRef={formikRef}
                                        >
                                            {({ values }) => (
                                                <Grid container component={Form} direction={'column'}>
                                                    <Grid container alignItems={'center'}>
                                                        <Grid item xs>
                                                            <FormikDesktopDatePicker
                                                                name={'startDate'}
                                                                label={'Start Date'}
                                                                fullWidth
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs
                                                            container
                                                            justifyContent={'center'}
                                                            maxWidth={'28px !important'}
                                                        >
                                                            <Typography variant={'body2'}>-</Typography>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <FormikDesktopDatePicker
                                                                name={'endDate'}
                                                                label={'End Date'}
                                                                minDate={values.startDate}
                                                                fullWidth
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container justifyContent={'flex-end'} mt={2.5}>
                                                        <FormikButton variant={'contained'} color={'primary'}>
                                                            Apply
                                                        </FormikButton>
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </Formik>
                                    </Grid>
                                ) : null}
                            </>
                        </FilterSelect>
                    ) : null}
                    {addButton ? <AddIcon onClick={onAddButtonClick} sx={{ cursor: 'pointer' }} /> : null}
                </Grid>
            </Grid>
        </Grid>
    );
}
