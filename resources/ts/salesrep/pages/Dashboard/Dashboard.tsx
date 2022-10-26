import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// import TablePagination from '@mui/material/TablePagination';

export function Dashboard() {
    return (
        <>
            <Grid sx={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #E0E0E0' }} width={'100%'}>
                <Typography variant={'h4'} fontWeight={500} mr={3} p={3}>
                    Dashboard
                </Typography>
            </Grid>
            <Grid container p={3} wrap={'nowrap'}>
                <Grid
                    md={6}
                    mr={1}
                    p={2}
                    border={'1px solid #E0E0E0'}
                    sx={{ background: '#FFFFFF', borderRadius: '4px' }}
                >
                    <Grid container item justifyContent={'space-between'} alignItems={'center'}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#0000008A' }}>Sales</Typography>
                    </Grid>
                    <Grid display={'flex'} mt={2} alignItems={'center'}>
                        <Grid>
                            <Typography variant={'h4'} sx={{ fontSize: '36px' }}>
                                $30000
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container px={3} wrap={'nowrap'}>
                <Grid
                    md={6}
                    mr={1}
                    p={2}
                    border={'1px solid #E0E0E0'}
                    sx={{ background: '#FFFFFF', borderRadius: '4px' }}
                >
                    <Grid container item justifyContent={'space-between'} alignItems={'center'}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#0000008A' }}>
                            Commission Earned
                        </Typography>
                    </Grid>
                    <Grid display={'flex'} mt={2} alignItems={'center'}>
                        <Grid>
                            <Typography variant={'h4'} sx={{ fontSize: '36px' }}>
                                $30000
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container p={3} m={3} sx={{ borderRadius: '4px', border: '1px solid #E0E0E0' }}>
                <Typography mb={2} fontSize={'16px'} fontWeight={500}>
                    Commission Payments
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{ fontSize: '12px', fontWeight: '500', paddingLeft: '0' }}
                                    align="left"
                                    variant={'head'}
                                >
                                    {/* <TableSortLabel
                                        sx={{
                                            position: 'absolute',
                                            left: '15%',
                                            marginTop: '2px',
                                            color: '#0000008A',
                                        }}
                                        onClick={() => handleSort(!sortFilter)}
                                        direction={!sortFilter ? 'desc' : 'asc'}
                                        active={true}
                                    ></TableSortLabel>{' '} */}
                                    Date
                                </TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }}>Added By</TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }}>Upload</TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }}>Notes</TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }}>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody></TableBody>
                        <TableFooter>
                            <TableRow>{/* <TablePagination {...data.paginationProps} /> */}</TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}

export default Dashboard;
