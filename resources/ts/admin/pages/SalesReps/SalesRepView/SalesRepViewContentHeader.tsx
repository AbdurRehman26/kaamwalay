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
        },
    }),
    { name: 'SalesRepViewContentHeader' },
);
export function SalesRepViewContentHeader() {
    const classes = useStyles();
    const { id } = useParams<{ id: string }>();

    return (
        <Grid component={'header'} container className={classes.root}>
            <TabList indicatorColor={'primary'} textColor={'primary'}>
                <Tab component={Link} to={'/salesreps/' + id + '/view/overview'} value={'overview'} label="Overview" />
                <Tab
                    component={Link}
                    to={'/salesreps/' + id + '/view/submissions'}
                    value={'submissions'}
                    label="Submissions"
                />
                <Tab
                    component={Link}
                    to={'/salesreps/' + id + '/view/customers'}
                    value={'customers'}
                    label="Customers"
                />
            </TabList>
        </Grid>
    );
}

export default SalesRepViewContentHeader;
