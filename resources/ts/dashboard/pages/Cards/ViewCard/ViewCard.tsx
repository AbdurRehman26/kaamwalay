import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled, Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserCardEntity } from '@shared/entities/UserCardEntity';
import { app } from '@shared/lib/app';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { UserCardsRepository } from '@shared/repositories/UserCardsRepository';
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

const useStyles = makeStyles(
    (theme) => ({
        tableContainer: {
            display: 'flex',
            flexDirection: 'row',
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column-reverse',
            },
        },
        viewPublicPageBtn: {
            maxHeight: '40px',
            minWidth: '200px',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                marginBottom: '12px',
            },
        },
    }),
    {
        name: 'viewCardStyles',
    },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: ViewCard
 * @date: 10.08.2021
 * @time: 01:39
 */
export function ViewCard() {
    // TODO: For some reason the useUserCardQuery hook isn't updating the latest data in the redux store, it is worth checking why, so we can use the hook instead of the repository here
    const userCardsRepository = app(UserCardsRepository);
    const [cardData, setCardData] = useState<UserCardEntity>();
    const { id } = useParams<{ id: string }>();

    // Hardcoding this to true until we enable filters for pending cards
    const isGraded = true;
    const classes = useStyles();
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const handleViewPublicPage = useCallback(() => {
        window.location.href = `https://robograding.com/feed/${cardData?.certificateNumber}/view`;
    }, [cardData?.certificateNumber]);

    useEffect(() => {
        async function fetchCardData() {
            const incomingCardData: UserCardEntity = await userCardsRepository.show(id);
            setCardData(incomingCardData);
        }

        fetchCardData();
    }, []);

    const cardImages = cardData?.generatedImages?.map((item) => ({
        title: item.name,
        url: item.outputImage,
    }));

    return (
        <Grid container>
            <Grid container spacing={3}>
                {!isSm ? (
                    <Grid item xs={4}>
                        <CardPreview image={cardData?.cardProduct?.imagePath ?? '-'} onlyImage />
                    </Grid>
                ) : null}

                <Grid item xs={12} sm={8}>
                    <Grid container alignItems={'center'}>
                        <Grid xs item container alignItems={'center'}>
                            <Typography variant={'h4'} className={font.fontWeightMedium}>
                                {cardData?.cardProduct?.name}
                            </Typography>
                            <Typography variant={'caption'} color={'textSecondary'}>
                                {cardData?.cardProduct?.fullName}
                            </Typography>
                        </Grid>

                        <Grid xs item container alignItems={'center'} justifyContent={'flex-end'}>
                            {isGraded ? (
                                <GradeStatus
                                    value={cardData?.overallGrade ?? '-'}
                                    label={cardData?.overallGradeNickname ?? '-'}
                                />
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
                    {!isSm ? null : (
                        <Grid container justifyContent={'center'} marginBottom={4}>
                            <CardPreview image={cardData?.cardProduct?.imagePath ?? '-'} onlyImage />
                        </Grid>
                    )}

                    <TableContainer className={classes.tableContainer}>
                        <Table size={'small'}>
                            <colgroup>
                                <col width={140} />
                                <col width={'auto'} />
                            </colgroup>
                            <TableBody>
                                <TableRow>
                                    <Cell variant={'head'}>Certificate #:</Cell>
                                    <Cell>{cardData?.certificateNumber}</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>Submission #:</Cell>
                                    <Cell>
                                        <MuiLink
                                            component={Link}
                                            to={`/submissions/${cardData?.submissionNumber}/view`}
                                            color={'primary'}
                                            variant={'body1'}
                                            className={font.fontWeightMedium}
                                        >
                                            {cardData?.submissionNumber}
                                        </MuiLink>
                                    </Cell>
                                </TableRow>
                                {/* <TableRow>*/}
                                {/*    <Cell variant={'head'}>ID Number:</Cell>*/}
                                {/*    <Cell>P7392020</Cell>*/}
                                {/* </TableRow>*/}
                                <TableRow>
                                    <Cell variant={'head'}>Card Type:</Cell>
                                    <Cell>{cardData?.cardProduct?.cardCategoryName}</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>Series:</Cell>
                                    <Cell>{cardData?.cardProduct?.cardSeriesName}</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>Set:</Cell>
                                    <Cell>{cardData?.cardProduct?.cardSetName}</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>Release Date:</Cell>
                                    <Cell>
                                        {formatDate(cardData?.cardProduct?.releaseDate ?? '-', 'MM/DD/YYYY') ?? '-'}
                                    </Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell variant={'head'}>Card:</Cell>
                                    <Cell>{cardData?.cardProduct?.cardNumberOrder}</Cell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Button
                            variant="outlined"
                            startIcon={<RemoveRedEyeOutlinedIcon />}
                            className={classes.viewPublicPageBtn}
                            onClick={handleViewPublicPage}
                        >
                            View public page
                        </Button>
                    </TableContainer>
                </Grid>
            </Grid>
            {!isGraded ? (
                <GradePendingMessage />
            ) : (
                <>
                    <CardGradeScore cardData={cardData} />
                    <CardGradeImages images={cardImages} />
                </>
            )}
        </Grid>
    );
}

export default ViewCard;
