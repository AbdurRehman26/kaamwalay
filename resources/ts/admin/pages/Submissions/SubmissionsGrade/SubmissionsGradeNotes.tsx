import TextField from '@material-ui/core/TextField';
import OutlinedCard from '@shared/components/OutlinedCard';

interface SubmissionsGradeNotesProps {}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: SubmissionsGradeNotes
 * @date: 28.08.2021
 * @time: 18:33
 */
export function SubmissionsGradeNotes(props: SubmissionsGradeNotesProps) {
    return (
        <OutlinedCard heading={'Notes'}>
            <TextField variant={'outlined'} placeholder={'Enter notes...'} fullWidth multiline rows={3} />
        </OutlinedCard>
    );
}

export default SubmissionsGradeNotes;
