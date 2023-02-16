import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { round } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { nameInitials } from '@shared/lib/strings/initials';
import { assignSalesRep, unAssignSalesRep } from '@shared/redux/slices/adminCustomersSlice';
import { getSalesReps } from '@shared/redux/slices/adminSalesRepSlice';
import { CustomerCreditDialog } from '@admin/components/CustomerCreditDialog';
import { useAppDispatch } from '@admin/redux/hooks';
import { CustomerSubmissionListView } from './CustomerSubmissionListView';

interface CustomerDetailProps {
    customer: CustomerEntity;
    handleResendCall?: any;
}

const Root = styled(Grid)({
    '.CustomerDetailBox': {
        boxSizing: 'border-box',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        margin: '20px',
        padding: '20px',
    },
    '.CustomerHeading': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '3px 0px',
    },
    '.CustomerValue': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '3px 0px',
        paddingLeft: '30px',
    },
    '.Submissions': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '.TotalSubmissions': {
        fontWeight: 300,
        fontSize: '50px',
        lineHeight: '59px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.Wallet': {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: '10px',
    },
    '.WalletTotalAmount': {
        fontWeight: 300,
        fontSize: '50px',
        lineHeight: '59px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '3px 0px',
    },
    '.Owner': {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: '10px',
    },
});

export function CustomerDetail({ customer, handleResendCall }: CustomerDetailProps) {
    const [creditDialog, setCreditDialog] = useState(false);
    const [defaultValue, setDefaultValue] = useState('Unassigned');
    const [salesReps, setSalesRep] = useState<SalesRepEntity[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    const handleCreditDialog = useCallback(() => {
        setCreditDialog(!creditDialog);
    }, [creditDialog]);

    useEffect(() => {
        (async () => {
            const data = await dispatch(getSalesReps());
            setSalesRep(data.payload.data);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function assignSalesRef(event: any) {
        if (event.target.value === 'none') {
            await dispatch(unAssignSalesRep({ userId: customer.id }));
        } else {
            await dispatch(assignSalesRep({ userId: customer.id, salesmanId: event.target.value }));
        }
        window.location.reload();
    }

    return (
        <>
            <Root container>
                <Grid container item xs className={'CustomerDetailBox'}>
                    <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                        <div>
                            <Typography className={'CustomerHeading'}>Signed Up:</Typography>
                            <Typography className={'CustomerHeading'}>Created By:</Typography>
                            <Typography className={'CustomerHeading'}>Accessed:</Typography>
                            <Typography className={'CustomerHeading'}>Paid Orders:</Typography>
                            <Typography className={'CustomerHeading'}>Referrer:</Typography>
                            {customer?.referredBy ? (
                                <Typography className={'CustomerHeading'}>Referral Status:</Typography>
                            ) : null}
                        </div>
                        <div>
                            <Typography className={'CustomerValue'}>
                                {formatDate(customer.createdAt, 'MM/DD/YYYY') ?? '-'}
                            </Typography>
                            <Typography className={'CustomerValue'}>
                                {customer?.createdBy ? `Admin (${customer?.createdBy?.fullName})` : 'User'}
                            </Typography>
                            <Typography className={'CustomerValue'}>{customer.lastLoginAt ? 'Yes' : 'No'}</Typography>
                            <Typography className={'CustomerValue'}>{customer?.submissions}</Typography>
                            <Typography className={'CustomerValue'}>
                                {customer?.referredBy ? (
                                    <MuiLink component={Link} color={'primary'} to={''}>
                                        {customer?.referredBy?.firstName} {customer?.referredBy?.lastName}
                                    </MuiLink>
                                ) : (
                                    '-'
                                )}
                            </Typography>
                            <Typography className={'CustomerValue'}>
                                {customer?.referrer?.isReferralActive ? 'Active' : 'Not Active'}
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
                <Grid container item xs className={'CustomerDetailBox'}>
                    <Grid container>
                        <div>
                            <Typography className={'Wallet'}>Wallet </Typography>
                            <Typography className={'WalletTotalAmount'}>
                                ${round(customer?.wallet?.balance, 2).toFixed(2)}
                            </Typography>
                        </div>
                        <Grid container item xs justifyContent={'flex-end'}>
                            <AddIcon onClick={handleCreditDialog} sx={{ cursor: 'pointer' }} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item xs className={'CustomerDetailBox'}>
                    <Typography className={'Owner'}>Owner</Typography>
                    <Select
                        sx={{ height: '40px !important' }}
                        aria-hidden={'false'}
                        onClick={(e: any) => e.stopPropagation()}
                        onChange={(e: any) => {
                            assignSalesRef(e);
                        }}
                        fullWidth
                        displayEmpty
                        onOpen={() => {
                            setDefaultValue('No Owner');
                            setIsOpen(true);
                        }}
                        onClose={() => {
                            setDefaultValue('Unassigned');
                            setIsOpen(false);
                        }}
                        value={customer?.salesman?.id || 'none'}
                    >
                        <MenuItem value="none">{defaultValue}</MenuItem>
                        {salesReps
                            .filter((saleRep) => {
                                return saleRep.id !== customer.id;
                            })
                            .map((saleRep) => {
                                return (
                                    <MenuItem
                                        key={saleRep?.id}
                                        value={saleRep?.id}
                                        sx={{ ':hover': { backgroundColor: 'transparent' } }}
                                    >
                                        <Grid
                                            width={'100%'}
                                            sx={{ ':hover': { backgroundColor: '#20BFB814' }, paddingLeft: '0px' }}
                                            display={'flex'}
                                            justifyContent={'flex-start'}
                                            p={1}
                                            alignItems={'left'}
                                        >
                                            <Avatar
                                                sx={{
                                                    marginRight: '5px',
                                                    padding: '2px',
                                                    height: '25px',
                                                    width: '25px',
                                                    fontSize: '12px',
                                                }}
                                                src={saleRep?.profileImage}
                                            >
                                                {nameInitials(
                                                    `${saleRep.firstName ?? ''} ${saleRep.lastName ?? ''}`.trim(),
                                                )}
                                            </Avatar>
                                            <Typography>{saleRep.fullName}</Typography>
                                            {customer?.salesman?.id === saleRep.id &&
                                            saleRep?.fullName.length > 10 &&
                                            isOpen ? (
                                                <DoneIcon sx={{ marginLeft: 'auto' }} color={'primary'} />
                                            ) : null}
                                        </Grid>
                                    </MenuItem>
                                );
                            })}
                    </Select>
                </Grid>
                <CustomerCreditDialog
                    customer={customer}
                    wallet={customer.wallet}
                    open={creditDialog}
                    onSubmit={handleResendCall}
                    onClose={handleCreditDialog}
                />
            </Root>
            <CustomerSubmissionListView />
        </>
    );
}

export default CustomerDetail;
