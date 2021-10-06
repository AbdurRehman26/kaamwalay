import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { PropsWithChildren } from 'react';

export function TableInfo({ children }: PropsWithChildren<{}>) {
    return (
        <TableContainer>
            <Table size={'small'} className={'table-info'}>
                <TableBody>{children}</TableBody>
            </Table>
        </TableContainer>
    );
}
