import Typography from '@material-ui/core/Typography';
import { useMemo } from 'react';
import { cx } from '@shared/lib/utils/cx';
import { useViewSubmissionStatusBarStyles } from './styles';

interface ViewSubmissionStatusBarProps {
    currentStep: string;
    steps: string[];
}

/**
 * @parent ViewSubmissionStatus
 * @private
 * @constructor
 */
export function ViewSubmissionStatusBar({ currentStep, steps }: ViewSubmissionStatusBarProps) {
    const styleOptions = useMemo(() => ({ itemWidth: 100 / steps.length }), [steps.length]);
    const classes = useViewSubmissionStatusBarStyles(styleOptions);
    const stepIndex = useMemo(() => steps.indexOf(currentStep), [steps, currentStep]);

    return (
        <nav className={classes.root}>
            {steps.map((step, index) => (
                <div className={classes.itemHolder} key={index}>
                    <div className={cx(classes.item, { [classes.itemActive]: index <= stepIndex })}>
                        <Typography variant={'body2'} className={classes.label}>
                            {step}
                        </Typography>
                    </div>
                </div>
            ))}
        </nav>
    );
}
