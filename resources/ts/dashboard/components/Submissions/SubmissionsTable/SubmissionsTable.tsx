import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useCallback, useState } from 'react';

import { SubmissionTableRow } from './SubmissionTableRow';
import { Table, TablePagination } from './styles';

// TODO: implement RTK Query
interface SubmissionsTableProps {
    items?: Object[];
    totals?: number;
}

export function SubmissionsTable({ totals }: SubmissionsTableProps) {
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleChangePage = useCallback((e, page) => setPage(page), [setPage]);
    const handleChangeRowsPerPage = useCallback((e) => setItemsPerPage(e.target.value), [setItemsPerPage]);

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant={'head'}>Submission #</TableCell>
                            <TableCell variant={'head'}>Date Placed</TableCell>
                            <TableCell variant={'head'}>Date Arrived</TableCell>
                            <TableCell variant={'head'}>Service Level</TableCell>
                            <TableCell variant={'head'}># Cards</TableCell>
                            <TableCell variant={'head'}>Status</TableCell>
                            <TableCell variant={'head'} />
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <SubmissionTableRow
                            id={'RG808078787'}
                            serviceLevel={'Basic'}
                            cardsNumber={1}
                            status={'Placed'}
                            datePlaced={new Date()}
                            dateArrived={null}
                        />
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                count={totals || 0}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={itemsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    );
}
