import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import { font } from '@shared/styles/utils';

import GradeScore from './GradeScore';

const useStyles = makeStyles(
    {
        root: {},
        spacing: {
            margin: '24px 0',
        },
        card: {
            width: '100%',
            height: '100%',
            backgroundColor: '#f9f9f9',
            border: '1px solid #e0e0e0',
            padding: 24,
            borderRadius: 4,
        },
        smallCardHolder: {
            paddingRight: 10,
        },
        largeCardHolder: {
            paddingLeft: 10,
        },
        titleHolder: {
            marginBottom: 14,
        },
        overallScore: {
            fontWeight: 700,
            '& small': {
                fontSize: 24,
                textTransform: 'uppercase',
                marginLeft: 14,
            },
        },
    },
    {
        name: 'CardGradeScore',
    },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: CardGradeScore
 * @date: 10.08.2021
 * @time: 22:40
 */
export function CardGradeScore() {
    const classes = useStyles();
    return (
        <Grid container direction={'column'} className={classes.root}>
            <Grid container className={classes.spacing} alignItems={'stretch'}>
                <Grid item xs={4} className={classes.smallCardHolder}>
                    <Grid className={classes.card} container alignItems={'center'} justifyContent={'center'}>
                        <Grid item container xs={12} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant={'body1'}>Overall Grade</Typography>
                            <Typography variant={'h3'} className={classes.overallScore}>
                                9.5
                                <small>Mint</small>
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={8} className={classes.largeCardHolder}>
                    <Grid className={classes.card} container alignItems={'center'} justifyContent={'center'}>
                        <GradeScore
                            xs={3}
                            alignItems={'center'}
                            labelVariant={'caption'}
                            label={'Centering (Overall)'}
                            value={10.0}
                            maxWidth={54}
                        />

                        <GradeScore
                            xs={3}
                            alignItems={'center'}
                            labelVariant={'caption'}
                            label={'Surface (Overall)'}
                            value={10.0}
                            maxWidth={54}
                        />

                        <GradeScore
                            xs={3}
                            alignItems={'center'}
                            labelVariant={'caption'}
                            label={'Edges (Overall)'}
                            value={10.0}
                            maxWidth={54}
                        />

                        <GradeScore
                            xs={3}
                            alignItems={'center'}
                            labelVariant={'caption'}
                            label={'Corners (Overall)'}
                            value={10.0}
                            maxWidth={54}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container className={classes.spacing} alignItems={'center'} justifyContent={'center'}>
                <Grid item xs={12} className={classes.titleHolder}>
                    <Typography variant={'h6'} className={font.fontWeightMedium}>
                        Front of Card Breakdown
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <GradeScore label={'Centering (Front)'} value={10.0} align={'left'} />
                </Grid>

                <Grid item xs={3}>
                    <GradeScore label={'Surface (Front)'} value={10.0} align={'left'} />
                </Grid>

                <Grid item xs={3}>
                    <GradeScore label={'Edges (Front)'} value={10.0} align={'left'} />
                </Grid>

                <Grid item xs={3}>
                    <GradeScore label={'Corners (Front)'} value={10.0} align={'left'} />
                </Grid>
            </Grid>
            <Divider className={classes.spacing} />
            <Grid container className={classes.spacing} alignItems={'center'} justifyContent={'center'}>
                <Grid item xs={12} className={classes.titleHolder}>
                    <Typography variant={'h6'} className={font.fontWeightMedium}>
                        Back of Card Breakdown
                    </Typography>
                </Grid>

                <GradeScore xs={3} label={'Centering (Back)'} value={10.0} align={'left'} />
                <GradeScore xs={3} label={'Surface (Back)'} value={10.0} align={'left'} />
                <GradeScore xs={3} label={'Edges (Back)'} value={10.0} align={'left'} />
                <GradeScore xs={3} label={'Corners (Back)'} value={10.0} align={'left'} />
            </Grid>
        </Grid>
    );
}

export default CardGradeScore;
