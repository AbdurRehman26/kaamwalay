import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { useCallback } from 'react';

import { OrderEntity } from '@shared/entities/OrderEntity';
import { useListOrdersQuery } from '@shared/hooks/useOrdersQuery';

import { SubmissionTableRow } from './SubmissionTableRow';
import { Table, TablePagination } from './styles';

interface SubmissionsTableProps {}

export function SubmissionsTable({}: SubmissionsTableProps) {
    const { isLoading, isError, data, pagination } = useListOrdersQuery();

    const handleChangePage = useCallback((e, page) => {}, []);
    const handleChangeRowsPerPage = useCallback((e) => {}, []);
    if (isLoading || isError) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                {isLoading ? <CircularProgress /> : <Typography color={'error'}>Error loading submissions</Typography>}
            </Box>
        );
    }
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
                        {data.map((data: OrderEntity, index) => {
                            console.log(data);
                            return (
                                <SubmissionTableRow
                                    key={index}
                                    id={data.orderNumber}
                                    serviceLevel={'Basic'}
                                    cardsNumber={data.numberOfCards}
                                    status={data.status}
                                    datePlaced={new Date()}
                                    dateArrived={null}
                                />
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                count={pagination.meta?.total || 0}
                                page={pagination.meta?.currentPage || 0}
                                rowsPerPage={pagination.meta?.perPage || 10}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    );
}
