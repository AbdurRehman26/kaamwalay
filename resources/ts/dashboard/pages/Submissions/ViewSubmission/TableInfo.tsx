import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
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
