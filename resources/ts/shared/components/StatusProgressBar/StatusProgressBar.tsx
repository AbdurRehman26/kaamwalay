import Grid from '@mui/material/Grid';
import React from 'react';
import StatusProgressItem from './StatusProgressItem';
import { StatusProgressStep } from './StatusProgressStep';

interface StatusProgressBarProps {
    steps: StatusProgressStep[];
}

export function StatusProgressBar({ steps }: StatusProgressBarProps) {
    const stepsLength = steps.length;
    const stepWidth = 100 / stepsLength;

    return (
        <Grid container alignItems={'center'}>
            {steps.map((step, index) => (
                <StatusProgressItem
                    isFirst={index === 0}
                    isLast={index === stepsLength - 1}
                    index={stepsLength - index}
                    key={index}
                    width={stepWidth}
                    {...step}
                />
            ))}
        </Grid>
    );
}

export default StatusProgressBar;
