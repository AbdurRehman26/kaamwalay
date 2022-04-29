import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { PropsWithChildren } from 'react';

interface SubmissionSummaryDescriptionProps {
    summaryDescription: string;
}

export function SubmissionSummaryDescription({
    summaryDescription,
}: PropsWithChildren<SubmissionSummaryDescriptionProps>) {
    return (
        <Typography variant={'caption'} color={'textSecondary'} align={'center'} my={1.5}>
            By clicking {summaryDescription}, you are agreeing to the Robograding{' '}
            <Link href={'/terms-and-conditions'} variant={'caption'} align={'center'} color={'#000'}>
                Terms and Conditions.
            </Link>
        </Typography>
    );
}

export default SubmissionSummaryDescription;
