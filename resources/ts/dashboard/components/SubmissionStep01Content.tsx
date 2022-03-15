import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getServiceLevels } from '../redux/slices/newSubmissionSlice';
import ServiceLevelItem from './ServiceLevelItem';
import StepDescription from './StepDescription';

const useStyles = makeStyles((theme) => ({
    pageContainer: {
        width: '100%',
        maxWidth: '750px',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '100%',
            padding: '16px',
        },
    },
    servicesContainer: {
        marginBottom: '64px',
    },
}));

export function SubmissionStep01Content() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const serviceLevels = useAppSelector((state) => state.newSubmission.step01Data.availableServiceLevels);
    useEffect(() => {
        dispatch(getServiceLevels());
    }, [dispatch]);

    useEffect(() => {}, [serviceLevels]);

    return (
        <div className={classes.pageContainer}>
            <StepDescription
                title="Select your service level"
                description="Select your desired service level from the list below"
            />
            <div className={classes.servicesContainer}>
                {serviceLevels.map((item: any) => (
                    <ServiceLevelItem {...item} key={item.id} />
                ))}
            </div>

            <Divider light />
        </div>
    );
}

export default SubmissionStep01Content;
