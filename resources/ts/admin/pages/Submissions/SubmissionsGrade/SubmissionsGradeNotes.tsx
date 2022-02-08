import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OutlinedCard from '@shared/components/OutlinedCard';
import { useAppDispatch } from '@admin/redux/hooks';
import { updateGeneralOrderNotes } from '@admin/redux/slices/submissionGradeSlice';

interface SubmissionsGradeNotesProps {
    notes?: string;
}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: SubmissionsGradeNotes
 * @date: 28.08.2021
 * @time: 18:33
 */
export function SubmissionsGradeNotes(props: SubmissionsGradeNotesProps) {
    const { id } = useParams<{ id: string }>();
    const [notesValue, setNotesValue] = useState(props.notes);
    const dispatch = useAppDispatch();

    const handleNotesChange = (e: any) => setNotesValue(e.target.value);
    const handleSaveNotes = async () => {
        await dispatch(
            updateGeneralOrderNotes({
                orderID: Number(id),
                notes: notesValue,
            }),
        ).unwrap();
    };

    useEffect(() => {
        setNotesValue(props.notes);
    }, [props.notes]);
    return (
        <OutlinedCard heading={'Notes'}>
            <TextField
                variant={'outlined'}
                value={notesValue ?? ''}
                onBlur={handleSaveNotes}
                onChange={handleNotesChange}
                placeholder={'Enter notes...'}
                fullWidth
                multiline
                rows={3}
            />
        </OutlinedCard>
    );
}

export default SubmissionsGradeNotes;
