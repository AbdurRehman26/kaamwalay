import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EnhancedTableHead from '@shared/components/Tables/EnhancedTableHead';
import { TableSortType } from '@shared/constants/TableSortType';

const StyledTableContainer = styled(TableContainer)({
    margin: '20px 0px',
    border: '1px solid #E0E0E0',
    borderRadius: '3px 3px 0px 0px',
    '.TableHeading': {
        background: '#F9F9F9',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '20px 15px',
    },
    '.Count': {
        color: 'rgba(0, 0, 0, 0.54)',
    },
});

interface props {
    heading: string;
    tableHeadings: any;
    tableRows: any;
    count: number;
    paginationProps: any;
    dispatchData?: any;
}

export function ReferralTable({ heading, tableHeadings, tableRows, count, paginationProps, dispatchData }: props) {
    const [order, setOrder] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');
    const dispatch = useDispatch();

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        dispatch(dispatchData);
    };

    return (
        <StyledTableContainer>
            <Grid sx={{ minWidth: 800 }}>
                <Typography className={'TableHeading'}>
                    {heading} <span className={'Count'}>({count})</span>
                </Typography>
            </Grid>
            <Table sx={{ minWidth: 800 }}>
                <EnhancedTableHead
                    onRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    headCells={tableHeadings}
                    isReferral
                />
                <TableBody>{tableRows}</TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            sx={{
                                background: '#F9F9F9',
                                borderRadius: '0px 0px 3px 3px',
                            }}
                            {...paginationProps}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </StyledTableContainer>
    );
}

export default ReferralTable;
