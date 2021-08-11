import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';
import React from 'react';

const Card = styled(Grid)(
    {},
    {
        name: 'Card',
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
    return (
        <Grid container>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Card container alignItems={'center'} justifyContent={'center'}>
                        <Typography>Overall Grade</Typography>
                        <Typography>
                            9.5
                            <small>Mint</small>
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={8}>
                    <Card container alignItems={'center'} justifyContent={'center'}>
                        <Grid item xs={3}>
                            <Typography>Centering (Overall)</Typography>
                            <Typography>10.00</Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography>Surface (Overall)</Typography>
                            <Typography>9.00</Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography>Edges (Overall)</Typography>
                            <Typography>10.00</Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography>Corners (Overall)</Typography>
                            <Typography>9.00</Typography>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            <Card container alignItems={'center'} justifyContent={'center'}>
                <Grid item xs={12}>
                    <Typography>Front of Card Breakdown</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography>Centering (Front)</Typography>
                    <Typography>10.00</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography>Surface (Front)</Typography>
                    <Typography>9.00</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography>Edges (Front)</Typography>
                    <Typography>10.00</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography>Corners (Front)</Typography>
                    <Typography>9.00</Typography>
                </Grid>
            </Card>
            <Divider />
            <Card container alignItems={'center'} justifyContent={'center'}>
                <Grid item xs={12}>
                    <Typography>Back of Card Breakdown</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography>Centering (Back)</Typography>
                    <Typography>10.00</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography>Surface (Back)</Typography>
                    <Typography>9.00</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography>Edges (Back)</Typography>
                    <Typography>10.00</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography>Corners (Back)</Typography>
                    <Typography>9.00</Typography>
                </Grid>
            </Card>
        </Grid>
    );
}

export default CardGradeScore;
