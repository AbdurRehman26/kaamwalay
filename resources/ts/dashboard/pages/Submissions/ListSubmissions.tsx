import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { useHistory } from 'react-router-dom';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { ListHeader } from '@dashboard/components/ListHeader/ListHeader';
import { SubmissionsTable } from '@dashboard/components/SubmissionsTable';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';

const useStyles = makeStyles(
    {
        newSubmissionBtn: {
            borderRadius: 24,
            padding: '12px 24px',
        },
    },
    {
        name: 'ListSubmissionsPage',
    },
);

export function ListSubmissions() {
    const classes = useStyles();
    const history = useHistory();
    const [search, setSearch] = useState('');

    function handleOnClick() {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.initiated,
        });
        history.push('/submissions/new');
        pushToDataLayer({ event: 'google-ads-started-submission-process' });
    }

    return (
        <>
            <ListHeader headline={'Submissions'} noMargin onSearch={setSearch}>
                <Button
                    onClick={handleOnClick}
                    variant={'contained'}
                    color={'primary'}
                    className={classes.newSubmissionBtn}
                >
                    New Submission
                </Button>
            </ListHeader>
            <SubmissionsTable search={search} />
        </>
    );
}
