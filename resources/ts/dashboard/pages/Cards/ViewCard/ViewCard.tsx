import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import cardPreview from '@shared/assets/cardPreview.png';
import { font } from '@shared/styles/utils';
import { CardPreview } from '@dashboard/components/CardPreview';
import { CardGradeScore } from '@dashboard/pages/Cards/ViewCard/CardGradeScore';
import CardGradeImages from './CardGradeImages';
import { GradePendingMessage } from './GradePendingMessage';
import { GradeStatus } from './GradeStatus';

const Cell = styled(TableCell)(
    {
        border: 'none',
        padding: '2px 8px 2px 0',
    },
    { name: 'Cell' },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: ViewCard
 * @date: 10.08.2021
 * @time: 01:39
 */
export function ViewCard() {
    const params = useParams<{ id: string }>();

    // TODO: implement api graded.
    const grade = parseInt(params.id);
    const isGraded = grade % 2 === 0;

    return (
        <Grid container>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <CardPreview image={cardPreview} onlyImage />
                </Grid>
                <Grid item xs={8}>
                    <Grid container alignItems={'center'}>
                        <Grid xs item container alignItems={'center'}>
                            <Typography variant={'h4'} className={font.fontWeightMedium}>
                                Charizard
                            </Typography>
                            <Typography variant={'caption'} color={'textSecondary'}>
                                2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard
                            </Typography>
                        </Grid>

                        <Grid xs item container alignItems={'center'} justifyContent={'flex-end'}>
                            {isGraded ? (
                                <GradeStatus value={grade} label={'Mint'} />
                            ) : (
                                <Typography variant={'body1'} color={'textSecondary'} className={font.fontWeightMedium}>
                                    Grade Pending
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                    <Box marginY={2}>
                        <Divider />
                    </Box>
                    <TableContainer>
                        <Table size={'small'}>
                            <colgroup>
                                <col width={140} />
                                <col width={'auto'} />
                            </colgroup>
                            <TableBody>
                                <TableRow>
                                    <Cell variant={'head'}>Certificate #:</Cell>
                                    <Cell>-</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>Submission #:</Cell>
                                    <Cell>
                                        <MuiLink
                                            component={Link}
                                            to={'/submissions/RG808078787/view'}
                                            color={'primary'}
                                            variant={'body1'}
                                            className={font.fontWeightMedium}
                                        >
                                            RG808078787
                                        </MuiLink>
                                    </Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>ID Number:</Cell>
                                    <Cell>P7392020</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>Card Type:</Cell>
                                    <Cell>Pokemon</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>Series:</Cell>
                                    <Cell>Sword & Shield</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>Set:</Cell>
                                    <Cell>Vivid Voyage</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>Release Date:</Cell>
                                    <Cell>August 23, 2019</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>Card:</Cell>
                                    <Cell>025</Cell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            {!isGraded ? (
                <GradePendingMessage />
            ) : (
                <>
                    <CardGradeScore />
                    <CardGradeImages />
                </>
            )}
        </Grid>
    );
}

export default ViewCard;
