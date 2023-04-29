import Container from '@mui/material/Container';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect } from 'react';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    getServiceLevels,
    setCustomStep,
    setOriginalServiceLevel,
    setServiceLevel,
} from '../../redux/slices/newSubmissionSlice';
import ServiceLevelItem from '../ServiceLevelItem';
import StepDescription from '../StepDescription';

const useStyles = makeStyles((theme) => ({
    servicesContainer: {
        marginBottom: theme.spacing(8),
    },
    contentContainer: {
        padding: 0,
    },
}));

type InitialValues = {
    plan: string;
};

export function SubmissionStep01Content() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const serviceLevels = useAppSelector((state) => state.newSubmission.step01Data.availableServiceLevels);
    const selectedServiceLevel = useAppSelector((state) => state.newSubmission.step01Data.selectedServiceLevel);
    const [query] = useLocationQuery<InitialValues>();
    const plan = query.plan;

    useEffect(() => {
        dispatch(getServiceLevels());
    }, [dispatch]);

    useEffect(() => {
        if (plan && serviceLevels.length > 1) {
            const selectedService: any = serviceLevels.find((service) => service.id === parseInt(plan));
            const { id, price, turnaround, type, maxProtectionAmount, priceRanges, minPrice, maxPrice } =
                selectedService;
            dispatch(
                setServiceLevel({ id, price, turnaround, type, maxProtectionAmount, priceRanges, minPrice, maxPrice }),
            );
            dispatch(
                setOriginalServiceLevel({
                    id,
                    price,
                    turnaround,
                    type,
                    maxProtectionAmount,
                    priceRanges,
                    minPrice,
                    maxPrice,
                }),
            );
            dispatch(setCustomStep(1));
        } else {
            const selectedService: any = serviceLevels.find((service) => service.id === selectedServiceLevel.id);
            const { id, price, turnaround, type, maxProtectionAmount, priceRanges, minPrice, maxPrice } =
                selectedService ?? serviceLevels[0];
            dispatch(
                setServiceLevel({ id, price, turnaround, type, maxProtectionAmount, priceRanges, minPrice, maxPrice }),
            );
            dispatch(
                setOriginalServiceLevel({
                    id,
                    price,
                    turnaround,
                    type,
                    maxProtectionAmount,
                    priceRanges,
                    minPrice,
                    maxPrice,
                }),
            );
        }
    }, [serviceLevels, dispatch, plan, selectedServiceLevel.id]);

    return (
        <Container className={classes.contentContainer} maxWidth={'md'}>
            <StepDescription
                title="Select your service level"
                description="Select your desired service level from the list below"
            />
            <div className={classes.servicesContainer}>
                {serviceLevels.map((item: any) => (
                    <ServiceLevelItem {...item} key={item.id} />
                ))}
            </div>
        </Container>
    );
}

export default SubmissionStep01Content;
