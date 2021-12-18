import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import { useParams } from 'react-router-dom';
import { useAdminOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { useSidebarHidden } from '@admin/hooks/useSidebarHidden';
import { useAppSelector } from '@admin/redux/hooks';
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
    const { id } = useParams<'id'>();
    const classes = useStyles();
    const allSubmissions = useAppSelector((state) => state.submissionGradesSlice.allSubmissions);

    function getGradedCards() {
        const gradedCards = allSubmissions.filter(
            (item: any) => item.orderItem?.status?.orderItemStatus?.name !== 'Confirmed',
        );
        return gradedCards.length;
    }
    useSidebarHidden();

    const { data } = useAdminOrderQuery({
        resourceId: Number(id),
        config: {
            params: {
                include: ['orderItems', 'orderStatus', 'orderStatusHistory.orderStatus'],
            },
        },
    });

    return (
        <Grid container direction={'column'}>
            <SubmissionsGradeHeader
                orderId={Number(id)}
                cardsGraded={getGradedCards()}
                cardsInOrder={allSubmissions.length}
                orderNumber={data?.orderNumber}
                reviewedAt={data?.reviewedAt}
                reviewer={data?.reviewedBy}
            />
            <Divider />
            <Container>
                <Grid container className={classes.content} spacing={3}>
                    <Grid item xs={8}>
                        <SubmissionsGradeCards />
                    </Grid>
                    <Grid item xs={4} className={classes.notes}>
                        <SubmissionsGradeNotes notes={data?.notes} />
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
}

export default SubmissionsGrade;
