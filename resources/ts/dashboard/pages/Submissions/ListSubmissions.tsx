import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { Link } from 'react-router-dom';

import { SubmissionsTable } from '@dashboard/components/SubmissionsTable';

const useStyles = makeStyles(
    {
        header: {
            marginBottom: 24,
        },
        headline: {
            fontWeight: 500,
        },
        newSubmissionBtn: {
            borderRadius: 24,
            padding: '12px 24px',
        },
        searchBarHolder: {
            padding: '0 20px',
        },
        searchBar: {
            width: '100%',
            height: 48,
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            borderRadius: 24,
        },
        searchBarIcon: {
            margin: '0 14px',
        },
    },
    {
        name: 'ListSubmissionsPage',
    },
);

export function ListSubmissions() {
    const classes = useStyles();

    return (
        <>
            <Grid container direction={'row'} alignItems={'center'} className={classes.header}>
                <Typography variant={'h5'} className={classes.headline}>
                    Submissions
                </Typography>
                <Box flexGrow={1} className={classes.searchBarHolder}>
                    <InputBase
                        className={classes.searchBar}
                        placeholder="Search…"
                        startAdornment={<SearchIcon className={classes.searchBarIcon} />}
                    />
                </Box>
                <Button
                    component={Link}
                    to={'/submissions/new'}
                    variant={'contained'}
                    color={'primary'}
                    className={classes.newSubmissionBtn}
                >
                    New Submission
                </Button>
            </Grid>
            <SubmissionsTable />
        </>
    );
}
