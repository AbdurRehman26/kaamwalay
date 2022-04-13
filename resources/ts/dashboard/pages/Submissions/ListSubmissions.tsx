import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useState } from 'react';
import ReactGA from 'react-ga';
import { useNavigate } from 'react-router-dom';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { googleTagManager } from '@shared/lib/utils/googleTagManager';
import { useListOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
import { ListHeader } from '@dashboard/components/ListHeader/ListHeader';
import { SubmissionsTable } from '@dashboard/components/SubmissionsTable';
import { clearSubmissionState } from '@dashboard/redux/slices/newSubmissionSlice';
import { useAppDispatch } from '../../redux/hooks';

const useStyles = makeStyles(
    (theme) => ({
        newSubmissionBtn: {
            borderRadius: 24,
            padding: '12px 24px',
            [theme.breakpoints.down('sm')]: {
                marginLeft: 'auto',
                padding: '9px 16px',
            },
        },
    }),
    {
        name: 'ListSubmissionsPage',
    },
);

export function ListSubmissions() {
    const classes = useStyles();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const dispatch = useAppDispatch();

    const orders$ = useListOrdersQuery({
        params: {
            filter: { orderNumber: search },
            include: ['paymentPlan', 'invoice', 'orderStatus', 'orderCustomerShipment'],
        },
        ...bracketParams(),
    });

    const redirectToNewSubmission = useCallback(() => {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.initiated,
        });
        googleTagManager({ event: 'google-ads-started-submission-process' });

        navigate('/submissions/new');
    }, [navigate]);

    function handleOnClick() {
        dispatch(clearSubmissionState());
        redirectToNewSubmission();
    }

    const $newSubmission = (
        <Button onClick={handleOnClick} variant={'contained'} color={'primary'} className={classes.newSubmissionBtn}>
            New Submission
        </Button>
    );

    return (
        <>
            <ListHeader
                headline={'Submissions'}
                noMargin
                onSearch={setSearch}
                actions={isMobile ? $newSubmission : null}
                noSearch={orders$.data.length === 0 && search === ''}
            >
                {!isMobile ? $newSubmission : null}
            </ListHeader>
            <SubmissionsTable search={search} />
        </>
    );
}
