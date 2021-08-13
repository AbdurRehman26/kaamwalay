import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Moment } from 'moment';
import { MouseEventHandler, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useConfirmation } from '@shared/hooks/useConfirmation';
import { formatDate } from '@shared/lib/datetime/formatDate';

interface SubmissionTableRowProps {
    id: number;
    orderNumber: string;
    serviceLevel: string;
    cardsNumber: number;
    status: string;
    disabled?: boolean;
    datePlaced?: Date | Moment | null;
    dateArrived?: Date | Moment | null;
}

enum Options {
    View,
    Edit,
    Delete,
}

export function SubmissionTableRow(props: SubmissionTableRowProps) {
    const { id, orderNumber, datePlaced, dateArrived, serviceLevel, cardsNumber, status, disabled } = props;

    const history = useHistory();
    const confirm = useConfirmation();

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);

    const handleOption = useCallback(
        (option: Options) => async () => {
            handleCloseOptions();

            switch (option) {
                case Options.View:
                    history.push(`/submissions/${id}/view`);
                    break;
                case Options.Edit:
                    history.push(`/submissions/${id}/edit`);
                    break;
                case Options.Delete:
                    const result = await confirm();
                    if (result) {
                        console.log('Delete submission');
                    }
                    break;
            }
        },
        [id, confirm, handleCloseOptions],
    );

    return (
        <TableRow>
            <TableCell>{orderNumber}</TableCell>
            <TableCell>{datePlaced ? formatDate(datePlaced, 'MM/DD/YYYY') : '-'}</TableCell>
            <TableCell>{dateArrived ? formatDate(dateArrived, 'MM/DD/YYYY') : '-'}</TableCell>
            <TableCell>{serviceLevel}</TableCell>
            <TableCell>{cardsNumber}</TableCell>
            <TableCell>{status}</TableCell>
            {/*<TableCell align={'right'}>*/}
            {/*    <IconButton onClick={handleClickOptions}>*/}
            {/*        <MoreIcon />*/}
            {/*    </IconButton>*/}

            {/*    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>*/}
            {/*        <MenuItem onClick={handleOption(Options.View)}>View</MenuItem>*/}
            {/*        <MenuItem onClick={handleOption(Options.Edit)}>Edit</MenuItem>*/}
            {/*        <MenuItem onClick={handleOption(Options.Delete)}>Delete</MenuItem>*/}
            {/*    </Menu>*/}
            {/*</TableCell>*/}
        </TableRow>
    );
}
