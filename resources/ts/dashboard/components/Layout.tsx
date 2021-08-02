import { Container, Divider, Grid, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useLocation } from 'react-router-dom';

import UserAvatar from '../assets/dummyLargeAvatar.png';
import AddedSubmissionCards from './AddedSubmissionCards';
import AppSidebar from './AppSidebar';
import CardSubmissionSearchField from './CardSubmissionSearchField';
import CardsSearchResults from './CardsSearchResults';
import DashboardHeader from './DashboardHeader';
import SubmissionSummary from './SubmissionSummary';

const useStyles = makeStyles({
    pageRoot: {
        marginTop: '28px',
    },
});

export default function Layout(props: any) {
    const classes = useStyles();
    const { children } = props;
    const location = useLocation();

    if (location.pathname === '/new-submission') {
        return <>{children}</>;
    }

    return (
        <div>
            {/* App Header */}
            <DashboardHeader />
            <Container className={classes.pageRoot}>
                <Grid container spacing={4}>
                    {/* App Side Bar */}
                    <Grid item xs={12} md={4}>
                        <AppSidebar />
                    </Grid>
                    {/* Page Content*/}
                    <Grid item xs={12} md={8}>
                        {children}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}
