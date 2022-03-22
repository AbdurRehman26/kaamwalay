import Container from '@mui/material/Container';
import React, { useEffect } from 'react';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getServiceLevels, setCustomStep, setServiceLevel } from '../redux/slices/newSubmissionSlice';
import ServiceLevelItem from './ServiceLevelItem';
import StepDescription from './StepDescription';

type InitialValues = {
    plan: string;
};

export function SubmissionStep01Content() {
    const dispatch = useAppDispatch();
    const serviceLevels = useAppSelector((state) => state.newSubmission.step01Data.availableServiceLevels);
    const [query] = useLocationQuery<InitialValues>();
    const plan = query.plan;

    useEffect(() => {
        dispatch(getServiceLevels());
    }, [dispatch]);

    useEffect(() => {
        if (plan && serviceLevels.length > 1) {
            const selectedService: any = serviceLevels.find((service) => service.id === parseInt(plan));
            const { id, price, turnaround, type, maxProtectionAmount } = selectedService;
            dispatch(setServiceLevel({ id, price, turnaround, type, maxProtectionAmount }));
            dispatch(setCustomStep(1));
        }
    }, [serviceLevels, dispatch, plan]);

    return (
        <Container maxWidth={'md'}>
            <StepDescription
                title="Select your service level"
                description="Select your desired service level from the list below"
            />
            {serviceLevels.map((item: any) => (
                <ServiceLevelItem {...item} key={item.id} />
            ))}
        </Container>
    );
}

export default SubmissionStep01Content;
