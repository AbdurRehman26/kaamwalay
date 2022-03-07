import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useState } from 'react';
import ReactGA from 'react-ga';
import { useNavigate } from 'react-router-dom';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { ListHeader } from '@dashboard/components/ListHeader/ListHeader';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useListOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
import { SubmissionsTable } from '@dashboard/components/SubmissionsTable';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';
import OrderIncompleteSubmissionsDialog from '@dashboard/components/OrderIncompleteSubmissionsDialog';
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
    const [showIncompleteSubmissions, setShowIncompleteSubmissions] = useState(false);
    const dispatch = useAppDispatch();

    const orders$ = useListOrdersQuery({
        params: {
            filter: { orderNumber: search },
            include: ['paymentPlan', 'invoice', 'orderStatus', 'orderCustomerShipment'],
        },
        ...bracketParams(),
    });

    const incompleteOrders$ = useListOrdersQuery({
        params: {
            filter: { orderStatusId: 1 },
            include: ['orderStatus'],
        },
        ...bracketParams(),
    });

    const redirectToNewSubmission = useCallback(() => {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.initiated,
        });
        pushToDataLayer({ event: 'google-ads-started-submission-process' });

        navigate('/submissions/new');
    }, [navigate]);

    function handleOnClick() {
        dispatch(clearSubmissionState());
        if (incompleteOrders$?.data?.length) {
            setShowIncompleteSubmissions(!showIncompleteSubmissions);
            return;
        }
        redirectToNewSubmission();
    }

    const $newSubmission = (
        <Button onClick={handleOnClick} variant={'contained'} color={'primary'} className={classes.newSubmissionBtn}>
            New Submission
        </Button>
    );

    return (
        <>
            <OrderIncompleteSubmissionsDialog
                open={showIncompleteSubmissions}
                onClose={() => setShowIncompleteSubmissions(false)}
                orders={incompleteOrders$?.data}
                onSubmit={redirectToNewSubmission}
            />

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
