import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { useSidebarHidden } from '@admin/hooks/useSidebarHidden';
import { SubmissionsGradeCards } from './SubmissionsGradeCards';
import { SubmissionsGradeHeader } from './SubmissionsGradeHeader';
import { SubmissionsGradeNotes } from './SubmissionsGradeNotes';

const useStyles = makeStyles(
    (theme) => ({
        content: {
            paddingTop: theme.spacing(4.5),
        },

        notes: {
            marginTop: theme.spacing(5),
        },
    }),
    { name: 'SubmissionsGrade' },
);

export function SubmissionsGrade() {
    const { id } = useParams<{ id: string }>();
    const classes = useStyles();

    useSidebarHidden();

    return (
        <Grid container direction={'column'}>
            <SubmissionsGradeHeader
                orderId={id}
                cardsGraded={0}
                orderNumber={'RG909098678'}
                reviewedAt={new Date()}
                reviewer={'Jim Johnson'}
            />
            <Divider />
            <Container>
                <Grid container className={classes.content} spacing={3}>
                    <Grid item xs={8}>
                        <SubmissionsGradeCards />
                    </Grid>
                    <Grid item xs={4} className={classes.notes}>
                        <SubmissionsGradeNotes />
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
}

export default SubmissionsGrade;
