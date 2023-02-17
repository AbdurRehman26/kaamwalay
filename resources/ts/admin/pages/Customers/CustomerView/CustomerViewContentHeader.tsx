import TabList from '@mui/lab/TabList';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            backgroundColor: '#f9f9f9',
            borderBottom: '1px solid #E0E0E0',
        },
    }),
    { name: 'CustomerViewContentHeader' },
);
export function CustomerViewContentHeader() {
    const classes = useStyles();
    const { id } = useParams<{ id: string }>();

    return (
        <Grid component={'header'} container className={classes.root}>
            <TabList indicatorColor={'primary'} textColor={'primary'}>
                <Tab component={Link} to={'/customers/' + id + '/view/overview'} value={'overview'} label="Overview" />
                <Tab
                    component={Link}
                    to={'/customers/' + id + '/view/referrals'}
                    value={'referrals'}
                    label="Referrals"
                />
                <Tab component={Link} to={''} disabled value={'payouts'} label="Payouts" />
            </TabList>
        </Grid>
    );
}

export default CustomerViewContentHeader;
