import MuiTablePagination from '@material-ui/core/TablePagination';
import { styled } from '@material-ui/core/styles';

export const TablePagination = styled(MuiTablePagination)(
    {
        width: '100%',
        borderBottom: 'none',
    },
    {
        name: 'TablePaginationStyle',
    },
);
