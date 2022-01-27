import MuiTablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';

export const TablePagination = styled(MuiTablePagination)(
    {
        width: '100%',
        borderBottom: 'none',
    },
    {
        name: 'TablePaginationStyle',
    },
);
