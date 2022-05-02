import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { cx } from '@shared/lib/utils/cx';
import { useViewSubmissionStatusBarStyles } from './styles';

interface ViewSubmissionStatusBarProps {
    isVaultStorage?: boolean;
    currentStep: string;
    steps: string[];
}

/**
 * @parent ViewSubmissionStatus
 * @private
 * @constructor
 */
export function ViewSubmissionStatusBar({ currentStep, steps, isVaultStorage }: ViewSubmissionStatusBarProps) {
    const styleOptions = useMemo(() => ({ itemWidth: 100 / steps.length }), [steps.length]);
    const stepIndex = useMemo(() => steps.indexOf(currentStep), [steps, currentStep]);

    const classes = useViewSubmissionStatusBarStyles(styleOptions);

    const getLabel = (step: string) => {
        if (step.toLowerCase() === 'shipped' && isVaultStorage) {
            return 'Stored in Vault';
        }

        return step;
    };

    return (
        <nav className={classes.root}>
            {steps.map((step, index) => (
                <div className={classes.itemHolder} key={index}>
                    <div className={cx(classes.item, { [classes.itemActive]: index <= stepIndex })}>
                        <Typography variant={'body2'} className={classes.label}>
                            {getLabel(step)}
                        </Typography>
                    </div>
                </div>
            ))}
        </nav>
    );
}
