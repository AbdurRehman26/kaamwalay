import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/VisibilityOutlined';
import { Link, useParams } from 'react-router-dom';
import { useSidebarHidden } from '@admin/hooks/useSidebarHidden';
import ConfirmedCards from './ConfirmedCards';
import MissingCards from './MissingCards';
import UnconfirmedCards from './UnconfirmedCards';

export function SubmissionsReview() {
    const { id } = useParams<{ id: string }>();

    useSidebarHidden();

    return (
        <Container>
            <Box pt={7} pb={3} display={'flex'} alignItems={'center'}>
                <Grid item xs>
                    <Typography variant={'h5'}>
                        Review Submission <b># RG909098678</b>
                    </Typography>
                </Grid>
                <Grid container item xs justifyContent={'flex-end'}>
                    <Button
                        component={Link}
                        to={`/submissions/${id}/view`}
                        startIcon={<VisibilityIcon color={'inherit'} />}
                        color={'primary'}
                    >
                        View Submission
                    </Button>
                </Grid>
            </Box>
            <Divider />
            <Box pt={3} pb={3}>
                <Grid container spacing={3}>
                    <Grid item xs>
                        <UnconfirmedCards />
                    </Grid>
                    <Grid item xs>
                        <ConfirmedCards />
                        <MissingCards />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default SubmissionsReview;
