import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import OutlinedCard from '@shared/components/OutlinedCard';
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';

interface SubmissionsGradeNotesProps {}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: SubmissionsGradeNotes
 * @date: 28.08.2021
 * @time: 18:33
 */
export function SubmissionsGradeNotes(props: SubmissionsGradeNotesProps) {
    const { id } = useParams<{ id: string }>();
    const apiService = useInjectable(APIService);

    const [notesValue, setNotesValue] = useState('');

    const handleNotesChange = (e: any) => setNotesValue(e.target.value);

    const handleSaveNotes = async () => {
        const endpoint = apiService.createEndpoint(`admin/orders/${id}/notes`);
        await endpoint.put('', {
            notes: notesValue,
        });
    };

    return (
        <OutlinedCard heading={'Notes'}>
            <TextField
                variant={'outlined'}
                value={notesValue}
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
