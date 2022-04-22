import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { PropsWithChildren } from 'react';

interface SubmissionSummaryDescriptionProps {
    summaryDescription: string;
}

const styles = {
    greyDescriptionText: {
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: 'center',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        marginTop: '12px',
        marginBottom: '12px',
    },
    darkDescriptionText: {
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: 'center',
        letterSpacing: '0.1px',
        color: '#000',
    },
};

export function SubmissionSummmaryDescription({
    summaryDescription,
}: PropsWithChildren<SubmissionSummaryDescriptionProps>) {
    return (
        <Typography sx={styles.greyDescriptionText}>
            By clicking {summaryDescription}, you are agreeing to the Robograding{' '}
            <Link href={'/terms-and-conditions'} sx={styles.darkDescriptionText}>
                Terms and Conditions.
            </Link>
        </Typography>
    );
}

export default SubmissionSummmaryDescription;
