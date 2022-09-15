import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { TableSortType } from '@shared/constants/TableSortType';

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    order: TableSortType;
    orderBy: string;
    headCells: Array<any>;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort, headCells } = props;
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        variant={'head'}
                    >
                        {headCell.sortable ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        ) : (
                            <>{headCell.label}</>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default EnhancedTableHead;
