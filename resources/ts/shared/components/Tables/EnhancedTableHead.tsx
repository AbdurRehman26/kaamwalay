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
    hasStyling?: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort, headCells, hasStyling } = props;
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
                        sx={{
                            color: hasStyling ? '#0000008A' : '',
                            fontSize: hasStyling ? '10px' : '',
                            fontWeight: hasStyling ? '500' : '',
                        }}
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
