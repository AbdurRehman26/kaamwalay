import Grid from '@mui/material/Grid';
import { ListPageHeader } from '../../components/ListPage/ListPageHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ListPageSelector from '../../components/ListPage/ListPageSelector';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Avatar from '@mui/material/Avatar';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { formatDate } from '@shared/lib/datetime/formatDate';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: CustomersListPage
 * @date: 23.12.2021
 * @time: 21:39
 */
export function CustomersListPage() {
    return (
        <Grid container>
            <ListPageHeader searchField title={'Customers'} onSearch={(val) => console.log('search', val)} />
            <Grid container p={2.5} alignItems={'center'}>
                <Grid item xs container alignItems={'center'}>
                    <Typography variant={'subtitle1'}>435 Results</Typography>
                    <Grid item xs ml={2}>
                        <ListPageSelector
                            label={'Submissions'}
                            value={'0'}
                            onClear={() => {
                                console.log('clear');
                            }}
                        >
                            <Grid container alignItems={'center'}>
                                <Grid item xs>
                                    <TextField label={'Min. Submissions'} fullWidth />
                                </Grid>
                                <Grid item xs container justifyContent={'center'} maxWidth={'28px !important'}>
                                    <Typography variant={'body2'}>-</Typography>
                                </Grid>
                                <Grid item xs>
                                    <TextField label={'Max. Submissions'} fullWidth />
                                </Grid>
                            </Grid>
                            <Grid container justifyContent={'flex-end'} mt={2.5}>
                                <Button variant={'contained'} color={'primary'}>
                                    Apply
                                </Button>
                            </Grid>
                        </ListPageSelector>

                        <ListPageSelector label={'Sign Up Date'}>
                            <Grid container alignItems={'center'}>
                                <Grid item xs>
                                    <TextField label={'Start Date'} fullWidth />
                                </Grid>
                                <Grid item xs container justifyContent={'center'} maxWidth={'28px !important'}>
                                    <Typography variant={'body2'}>-</Typography>
                                </Grid>
                                <Grid item xs>
                                    <TextField label={'End Date'} fullWidth />
                                </Grid>
                            </Grid>
                            <Grid container justifyContent={'flex-end'} mt={2.5}>
                                <Button variant={'contained'} color={'primary'}>
                                    Apply
                                </Button>
                            </Grid>
                        </ListPageSelector>
                    </Grid>
                </Grid>
                <Grid item xs container justifyContent={'flex-end'}>
                    <Button variant={'outlined'} color={'primary'} sx={{ borderRadius: 20, padding: '7px 24px' }}>
                        Export List
                    </Button>
                </Grid>
            </Grid>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant={'head'}>Name / ID</TableCell>
                            <TableCell variant={'head'}>Email</TableCell>
                            <TableCell variant={'head'}>Phone</TableCell>
                            <TableCell variant={'head'}>Signed Up</TableCell>
                            <TableCell variant={'head'} align={'right'}>
                                Submissions
                            </TableCell>
                            <TableCell variant={'head'} align={'right'}>
                                Wallet Balance
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell variant={'body'}>
                                <Grid container>
                                    <Avatar>AC</Avatar>
                                    <Grid item xs container direction={'column'} pl={2}>
                                        <Typography variant={'body2'}>Albert Camus</Typography>
                                        <Typography variant={'caption'} color={'textSecondary'}>
                                            C00001234
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell variant={'body'}>email@email.com</TableCell>
                            <TableCell variant={'body'}>+1 (718) 922 - 9292</TableCell>
                            <TableCell variant={'body'}>{formatDate(new Date(), 'MM/DD/YYYY')}</TableCell>
                            <TableCell variant={'body'} align={'right'}>
                                3
                            </TableCell>
                            <TableCell variant={'body'} align={'right'}>
                                {formatCurrency(60)}
                            </TableCell>
                            <TableCell variant={'body'} align={'right'}>
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
}

export default CustomersListPage;
