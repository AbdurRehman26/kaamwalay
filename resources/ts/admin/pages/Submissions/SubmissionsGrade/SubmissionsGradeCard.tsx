import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback } from 'react';
import dummyCharizard from '@shared/assets/dummyCharizard.png';
import {
    AccordionCardItem,
    AccordionCardItemHeader,
    AccordionCardItemContent,
} from '@shared/components/AccordionCardItem';
import { cx } from '@shared/lib/utils/cx';
import { SubmissionsGradeCardGrades } from './SubmissionsGradeCardGrades';

interface SubmissionsGradeCardProps {
    itemId: number;
    onNotAccepted(itemId: number): void;
    onMissing(itemId: number): void;
}

const useStyles = makeStyles(
    (theme) => ({
        button: {
            marginRight: theme.spacing(1),
        },
        actions: {
            marginTop: theme.spacing(2.5),
        },
        statusButton: {},
        disabledButton: {},
        submitButton: {
            marginTop: theme.spacing(2.5),
            marginBottom: theme.spacing(1),
        },
    }),
    { name: 'SubmissionsGradeCard' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: SubmissionsGradeCard
 * @date: 28.08.2021
 * @time: 19:09
 */
export function SubmissionsGradeCard({ itemId, onNotAccepted, onMissing }: SubmissionsGradeCardProps) {
    const classes = useStyles();
    const handleNotAccepted = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            onNotAccepted(itemId);
        },
        [onNotAccepted, itemId],
    );

    const handleMissing = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            onMissing(itemId);
        },
        [onMissing, itemId],
    );

    return (
        <AccordionCardItem variant={'outlined'}>
            <AccordionCardItemHeader
                heading={'Charizard'}
                image={dummyCharizard}
                subheading={'2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard'}
                action={
                    <Button disabled variant={'outlined'} className={cx(classes.statusButton, classes.disabledButton)}>
                        Grade Pending
                    </Button>
                }
            >
                <Grid container className={classes.actions}>
                    <Grid item xs>
                        <Button variant={'contained'} onClick={handleNotAccepted} className={classes.button}>
                            Not Accepted
                        </Button>
                        <Button variant={'contained'} onClick={handleMissing} className={classes.button}>
                            Missing
                        </Button>
                    </Grid>
                    <Grid container item xs justifyContent={'flex-end'}>
                        <TextField size={'small'} variant={'outlined'} value={'1.1'} label={'A.I. Model #'} />
                    </Grid>
                </Grid>
            </AccordionCardItemHeader>

            <AccordionCardItemContent>
                <SubmissionsGradeCardGrades heading={'Front of Card'} view={'front'} />
                <SubmissionsGradeCardGrades heading={'Back of Card'} view={'back'} />

                <Grid container justifyContent={'flex-end'}>
                    <Button
                        variant={'contained'}
                        disableElevation
                        disabled
                        color={'primary'}
                        className={classes.submitButton}
                    >
                        Done
                    </Button>
                </Grid>
            </AccordionCardItemContent>
        </AccordionCardItem>
    );
}

export default SubmissionsGradeCard;
