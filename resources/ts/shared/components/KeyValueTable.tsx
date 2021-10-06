import Table, { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import { useMemo } from 'react';

interface KeyValueTableProps extends TableProps {
    entries: Record<string, any> | [key: string, value: any][];
}

const useStyles = makeStyles(
    {
        cell: {
            border: 'none',
            padding: '2px',
        },
    },
    { name: 'KeyValueTable' },
);

export function KeyValueTable({ entries, ...rest }: KeyValueTableProps) {
    const classes = useStyles();

    const entries$ = useMemo(() => {
        if (!Array.isArray(entries)) {
            return Object.entries(entries);
        }

        return entries;
    }, [entries]);

    return (
        <TableContainer>
            <Table size={'small'} {...rest}>
                <TableBody>
                    {entries$.map(([key, value], index) => (
                        <TableRow key={index}>
                            <TableCell className={classes.cell} variant={'head'}>
                                {key ? key : <>&nbsp;</>}
                            </TableCell>
                            <TableCell className={classes.cell} variant={'body'}>
                                {value}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default KeyValueTable;
