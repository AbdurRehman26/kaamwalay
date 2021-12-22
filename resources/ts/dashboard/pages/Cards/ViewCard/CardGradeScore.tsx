import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { UserCardEntity } from '@shared/entities/UserCardEntity';
import { cx } from '@shared/lib/utils/cx';
import { font } from '@shared/styles/utils';
import GradeScore from './GradeScore';

const useStyles = makeStyles(
    (theme) => ({
        root: {},
        overallGradesContainer: {
            [theme.breakpoints.down('sm')]: {
                flexWrap: 'noWrap',
                flexDirection: 'column',
            },
        },
        overallGradeDataContainer: {
            flexDirection: 'column',
        },
        largeOverallGradesContainer: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            width: '100%',
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
            },
        },
        overallGradesRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            [theme.breakpoints.down('sm')]: {
                marginBottom: '8px',
            },
        },
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
            [theme.breakpoints.down('sm')]: {
                paddingRight: 0,
                maxHeight: '118px',
            },
        },
        largeCardHolder: {
            paddingLeft: 10,
            [theme.breakpoints.down('sm')]: {
                paddingLeft: 0,
                marginTop: '24px',
            },
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
        rowMargin: {
            marginLeft: '-100px',
            [theme.breakpoints.down('sm')]: {
                marginLeft: '-50px',
            },
        },
    }),

    {
        name: 'CardGradeScore',
    },
);

interface CardGradeScoreProps {
    cardData?: UserCardEntity;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: CardGradeScore
 * @date: 10.08.2021
 * @time: 22:40
 */
export function CardGradeScore({ cardData }: CardGradeScoreProps) {
    const classes = useStyles();
    return (
        <Grid container direction={'column'} className={classes.root}>
            <Grid container className={cx(classes.spacing, classes.overallGradesContainer)} alignItems={'stretch'}>
                <Grid item xs={12} sm={4} className={classes.smallCardHolder}>
                    <Grid className={classes.card} container alignItems={'center'} justifyContent={'center'}>
                        <Grid
                            item
                            container
                            xs={12}
                            className={classes.overallGradeDataContainer}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <Typography variant={'body1'}>Overall Grade</Typography>
                            <Typography variant={'h3'} className={classes.overallScore}>
                                {cardData?.overallGrade ?? '-'}
                                <small>{cardData?.overallGradeNickname ?? '-'}</small>
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={8} className={classes.largeCardHolder}>
                    <Grid
                        className={cx(classes.card, classes.largeOverallGradesContainer)}
                        container
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Grid container className={classes.overallGradesRow}>
                            <GradeScore
                                xs={3}
                                alignItems={'center'}
                                labelVariant={'caption'}
                                label={'Centering (Overall)'}
                                value={cardData?.overallValues?.center ?? '-'}
                                maxWidth={54}
                            />

                            <GradeScore
                                xs={3}
                                alignItems={'center'}
                                labelVariant={'caption'}
                                label={'Surface (Overall)'}
                                value={cardData?.overallValues?.surface ?? '-'}
                                maxWidth={54}
                            />
                        </Grid>

                        <Grid container className={classes.overallGradesRow}>
                            <GradeScore
                                xs={3}
                                alignItems={'center'}
                                labelVariant={'caption'}
                                label={'Edges (Overall)'}
                                value={cardData?.overallValues?.edge ?? '-'}
                                maxWidth={54}
                            />

                            <GradeScore
                                xs={3}
                                alignItems={'center'}
                                labelVariant={'caption'}
                                label={'Corners (Overall)'}
                                value={cardData?.overallValues?.corner ?? '-'}
                                maxWidth={54}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container className={classes.spacing} alignItems={'center'} justifyContent={'center'}>
                <Grid item xs={12} className={classes.titleHolder}>
                    <Typography variant={'h6'} className={font.fontWeightMedium}>
                        Front of Card Breakdown
                    </Typography>
                </Grid>
                <div className={cx(classes.largeOverallGradesContainer, classes.rowMargin)}>
                    <Grid container className={classes.overallGradesRow}>
                        <Grid item xs={3}>
                            <GradeScore
                                label={'Centering (Front)'}
                                value={cardData?.humanGradeValues?.front?.center ?? '-'}
                                align={'left'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <GradeScore
                                label={'Surface (Front)'}
                                value={cardData?.humanGradeValues?.front?.surface ?? '-'}
                                align={'left'}
                            />
                        </Grid>
                    </Grid>

                    <Grid container className={classes.overallGradesRow}>
                        <Grid item xs={3}>
                            <GradeScore
                                label={'Edges (Front)'}
                                value={cardData?.humanGradeValues?.front?.edge ?? '-'}
                                align={'left'}
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <GradeScore
                                label={'Corners (Front)'}
                                value={cardData?.humanGradeValues?.front?.corner ?? '-'}
                                align={'left'}
                            />
                        </Grid>
                    </Grid>
                </div>
            </Grid>
            <Divider className={classes.spacing} />
            <Grid container className={classes.spacing} alignItems={'center'} justifyContent={'center'}>
                <Grid item xs={12} className={classes.titleHolder}>
                    <Typography variant={'h6'} className={font.fontWeightMedium}>
                        Back of Card Breakdown
                    </Typography>
                </Grid>
                <div className={cx(classes.largeOverallGradesContainer, classes.rowMargin)}>
                    <Grid container className={classes.overallGradesRow}>
                        <GradeScore
                            xs={3}
                            label={'Centering (Back)'}
                            value={cardData?.humanGradeValues?.back?.center ?? '-'}
                            align={'left'}
                        />
                        <GradeScore
                            xs={3}
                            label={'Surface (Back)'}
                            value={cardData?.humanGradeValues?.back?.surface ?? '-'}
                            align={'left'}
                        />
                    </Grid>

                    <Grid container className={classes.overallGradesRow}>
                        <GradeScore
                            xs={3}
                            label={'Edges (Back)'}
                            value={cardData?.humanGradeValues?.back?.edge ?? '-'}
                            align={'left'}
                        />
                        <GradeScore
                            xs={3}
                            label={'Corners (Back)'}
                            value={cardData?.humanGradeValues?.back?.corner ?? '-'}
                            align={'left'}
                        />
                    </Grid>
                </div>
            </Grid>
            <Divider className={classes.spacing} />
            {cardData?.orderItem.notes ? (
                <>
                    <Grid container className={classes.spacing}>
                        <Grid item xs={12} className={classes.titleHolder}>
                            <Typography variant={'h6'} className={font.fontWeightMedium}>
                                Notes
                            </Typography>
                        </Grid>
                        <div>
                            <Typography variant={'body2'}>{cardData.orderItem.notes}</Typography>
                        </div>
                    </Grid>
                    <Divider className={classes.spacing} />
                </>
            ) : null}
        </Grid>
    );
}

export default CardGradeScore;
