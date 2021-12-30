import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { useNavigate } from 'react-router-dom';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
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
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    function handleOnClick() {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.initiated,
        });
        navigate('/submissions/new');
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
