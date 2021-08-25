import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ReactGA from 'react-ga';
import { useHistory } from 'react-router-dom';
import { EventCategories, SubmissionEvents } from '@dashboard/components/GoogleAnalyticsWrapper/GAEventsTypes';
import { ListHeader } from '@dashboard/components/ListHeader/ListHeader';
import { SubmissionsTable } from '@dashboard/components/SubmissionsTable';

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

    function handleOnClick() {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.initiated,
        });
        history.push('/submissions/new');
    }

    return (
        <>
            <ListHeader headline={'Submissions'} noMargin noSearch>
                <Button
                    onClick={handleOnClick}
                    variant={'contained'}
                    color={'primary'}
                    className={classes.newSubmissionBtn}
                >
                    New Submission
                </Button>
            </ListHeader>
            <SubmissionsTable />
        </>
    );
}
