import MuiTable from '@material-ui/core/Table';
import MuiTablePagination from '@material-ui/core/TablePagination';
import { styled } from '@material-ui/core/styles';

export const Table = styled(MuiTable)(
    {
        borderTop: '1px solid #e0e0e0',
    },
    {
        name: 'TableStyle',
    },
);

export const TablePagination = styled(MuiTablePagination)(
    {
        width: '100%',
        borderBottom: 'none',
    },
    {
        name: 'TablePaginationStyle',
    },
);
