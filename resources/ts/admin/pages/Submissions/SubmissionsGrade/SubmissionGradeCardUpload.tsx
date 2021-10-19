import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import NoImagePlaceholder from '@shared/assets/no-image.png';
import OutlinedCard from '@shared/components/OutlinedCard';
import { useAppSelector } from '@admin/redux/hooks';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(3),
        },
        imagesContainer: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        imageContainer: {
            display: 'flex',
            flexDirection: 'column',
            margin: '12px',
        },
        image: {
            maxWidth: '160px',
        },
    }),
    { name: 'SubmissionsGradeCardGrades' },
);

function SubmissionGradeCardUpload({ itemIndex }: { itemIndex: number }) {
    const classes = useStyles();
    const generatedImages = useAppSelector(
        (state) => state.submissionGradesSlice.allSubmissions[itemIndex].generatedImages,
    );

    return (
        <OutlinedCard heading={'Uploads'} icon={''} className={classes.root}>
            <div className={classes.imagesContainer}>
                {generatedImages.map((item: any, index: any) => (
                    <div key={index} className={classes.imageContainer}>
                        <Typography variant={'subtitle2'}>{item.name}</Typography>
                        <img
                            src={item.outputImage !== null ? item.outputImage : NoImagePlaceholder}
                            alt={'Generated'}
                            className={classes.image}
                        />
                    </div>
                ))}
            </div>
        </OutlinedCard>
    );
}

export default SubmissionGradeCardUpload;
