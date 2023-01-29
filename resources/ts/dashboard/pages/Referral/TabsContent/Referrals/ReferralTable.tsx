import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import EnhancedTableHead from '@shared/components/Tables/EnhancedTableHead';
import { TableSortType } from '@shared/constants/TableSortType';
import { nameInitials } from '@shared/lib/strings/initials';

const StyledTableCell = styled(TableCell)({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#F9F9F9;',
        fontWeight: 500,
        fontSize: '10px',
        lineHeight: '16px',
        letterSpacing: '0.75px',
        textTransform: 'uppercase',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    [`&.${tableCellClasses.body}`]: {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
        '&:last-child': {
            fontWeight: 700,
            color: '#20BFB8',
        },
    },
});

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
        padding: '15px 15px',
    },
});

interface props {
    data: any;
    heading: string;
    tableHeading: any;
    isCustomerSignup?: boolean;
}

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Alban Toci', 159, 6.0, 24, 4.0),
    createData('Alban Toci', 237, 9.0, 37, 4.3),
    createData('Alban Toci', 262, 16.0, 24, 6.0),
    createData('Alban Toci', 305, 3.7, 67, 4.3),
    createData('Alban Toci', 356, 16.0, 49, 3.9),
];

export function ReferralTable({ data, heading, tableHeading, isCustomerSignup }: props) {
    const [order, setOrder] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <StyledTableContainer>
            <Typography className={'TableHeading'}>{heading} (9)</Typography>
            <Table sx={{ minWidth: 800 }}>
                <EnhancedTableHead
                    onRequestSort={handleRequestSort}
                    order={order}
                    orderBy={orderBy}
                    headCells={tableHeading}
                    isReferral
                />
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={'Alban Toci'}>
                            <StyledTableCell>
                                <Grid container alignItems={'center'}>
                                    <Avatar src={''}>{nameInitials('Alban Toci')}</Avatar>
                                    <Grid item xs container pl={2}>
                                        <Typography sx={{ fontSize: '14px' }}>{'Alban Toci'}</Typography>
                                    </Grid>
                                </Grid>
                            </StyledTableCell>
                            <StyledTableCell>Jan 1, 2023 at 10:54 AM</StyledTableCell>
                            <StyledTableCell align={'right'}>5</StyledTableCell>
                            {isCustomerSignup ? <StyledTableCell align={'right'}>5</StyledTableCell> : null}
                            <StyledTableCell align={'right'}>$100.00</StyledTableCell>
                            <StyledTableCell align={'right'}>$100.00</StyledTableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            sx={{
                                background: '#F9F9F9',
                                borderRadius: '0px 0px 3px 3px',
                            }}
                            rowsPerPageOptions={[5, 10, 25]}
                            count={rows.length}
                            rowsPerPage={1}
                            page={1}
                            onPageChange={() => {}}
                            onRowsPerPageChange={() => {}}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </StyledTableContainer>
    );
}

export default ReferralTable;
