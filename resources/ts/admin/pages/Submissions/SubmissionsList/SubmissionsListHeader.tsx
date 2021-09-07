import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { TabList } from '@material-ui/lab';
import React from 'react';
import { Link } from 'react-router-dom';
import { font } from '@shared/styles/utils';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            backgroundColor: '#f9f9f9',
        },

        header: {
            padding: theme.spacing(3),
        },
        scanButton: {
            borderRadius: 18,
        },
    }),
    { name: 'SubmissionsListHeader' },
);

export function SubmissionsListHeader() {
    const classes = useStyles();

    return (
        <Grid component={'header'} container className={classes.root}>
            <Grid container alignItems={'center'} className={classes.header}>
                <Grid item xs>
                    <Typography variant={'h4'} className={font.fontWeightBold}>
                        Submissions
                    </Typography>
                </Grid>
                <Grid container item xs justifyContent={'flex-end'}>
                    <Tooltip title={'Coming Soon'}>
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            startIcon={<Icon>qr_code_scanner</Icon>}
                            className={classes.scanButton}
                        >
                            Scan Barcode
                        </Button>
                    </Tooltip>
                </Grid>
            </Grid>
            <TabList indicatorColor={'primary'} textColor={'primary'}>
                <Tab component={Link} to={'/submissions/all/list'} value={'all'} label="All" />
                <Tab component={Link} to={'/submissions/pending/list'} value={'pending'} label="Pending" />
                <Tab component={Link} to={'/submissions/reviewed/list'} value={'reviewed'} label="Reviewed" />
                <Tab component={Link} to={'/submissions/graded/list'} value={'graded'} label="Graded" />
                <Tab component={Link} to={'/submissions/shipped/list'} value={'shipped'} label="Shipped" />
            </TabList>
        </Grid>
    );
}

export default SubmissionsListHeader;
