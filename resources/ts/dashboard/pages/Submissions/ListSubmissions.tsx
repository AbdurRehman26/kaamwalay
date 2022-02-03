import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { useNavigate } from 'react-router-dom';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { ListHeader } from '@dashboard/components/ListHeader/ListHeader';
import { SubmissionsTable } from '@dashboard/components/SubmissionsTable';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';

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

    function handleOnClick() {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.initiated,
        });
        pushToDataLayer({ event: 'google-ads-started-submission-process' });
        navigate('/submissions/new');
    }

    const $newSubmission = (
        <Button onClick={handleOnClick} variant={'contained'} color={'primary'} className={classes.newSubmissionBtn}>
            New Submission
        </Button>
    );

    return (
        <>
            <ListHeader headline={'Submissions'} noMargin onSearch={setSearch} isSubmission action={$newSubmission}>
                {!isMobile ? $newSubmission : null}
            </ListHeader>
            <SubmissionsTable search={search} />
        </>
    );
}
