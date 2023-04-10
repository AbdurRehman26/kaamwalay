import SearchIcon from '@mui/icons-material/Search';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { PayoutStatusEnum } from '@shared/constants/PayoutStatusEnum';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useAdminReferralPayoutsQuery } from '@shared/redux/hooks/useAdminReferralPayoutsQuery';
import { payReferralCommissions } from '@shared/redux/slices/adminReferralPayoutSlice';
import theme from '@shared/styles/theme';
import { useAppDispatch } from '@admin/redux/hooks';
import PayoutCommissionDialog from './PayoutCommissionDialog';

interface HeaderProps {
    onSearch: (query: string) => void;
    tabs?: React.ReactNode;
}

const styles = {
    header: {
        padding: theme.spacing(3),
    },
    customerSearch: {
        padding: '0px',
    },
    searchField: {
        backgroundColor: '#fff',
        borderRadius: 24,
        marginLeft: theme.spacing(2),
    },
    title: {
        fontWeight: 500,
        fontSize: '32px',
        lineHeight: '44px',
    },
    headerStyle: {
        backgroundColor: '#f9f9f9',
        borderBottom: '1px solid #E0E0E0',
    },
    payoutButton: {
        borderRadius: '24px',
        padding: '12px 24px',
        marginLeft: '10px',
    },
};

const useStyles = makeStyles(
    (theme) => ({
        searchFieldNotch: {
            borderRadius: 24,
        },
        searchFieldInput: {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(1.5),
            height: 24,
        },
    }),
    { name: 'Header' },
);

const debouncedFunc = debounce((func: any) => {
    func();
}, 300);

export function ReferralProgramPayoutHeader({ onSearch, tabs }: HeaderProps) {
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const [pendingPayouts, setPendingPayouts] = useState<PayoutEntity[]>([]);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const [payoutTotal, setPayoutTotal] = useState(0);
    const [showPayoutCommission, setShowPayoutCommission] = useState(false);

    const payouts = useAdminReferralPayoutsQuery({
        params: {
            filter: {
                referrerPayoutStatusId: 1,
            },
        },
        ...bracketParams(),
    });

    useEffect(() => {
        const data = payouts.data.filter((payout: PayoutEntity) => payout.status.id === PayoutStatusEnum.PENDING);
        setPendingPayouts(data);
    }, [payouts.data]);

    const handleSearch = useCallback(
        (e) => {
            setSearch(e.target.value);
            if (onSearch) {
                debouncedFunc(() => {
                    onSearch(e.target.value);
                });
            }
        },
        [setSearch, onSearch],
    );

    const handlePayReferralCommissions = async () => {
        setLoading(true);
        await dispatch(payReferralCommissions({ allPending: true }));
        window.location.reload();
    };

    const calculateTotal = () => {
        const data: number[] = [];
        payouts.data
            .filter((payout: PayoutEntity) => payout.status.id === PayoutStatusEnum.PENDING)
            .map((payout: PayoutEntity) => {
                data.push(parseFloat(payout.amount.toString()));
            });
        setPayoutTotal(data.reduce((a, b) => a + b, 0));
    };

    const handlePayCommission = () => {
        calculateTotal();
        setShowPayoutCommission(true);
    };

    const handleDialogClose = () => {
        setPayoutTotal(0);
        setShowPayoutCommission(false);
    };

    return (
        <>
            <PayoutCommissionDialog
                onSubmit={() => handlePayReferralCommissions()}
                onClose={() => {
                    handleDialogClose();
                }}
                open={showPayoutCommission}
                totalRecipient={pendingPayouts.length}
                totalPayout={payoutTotal}
            />
            <Grid component={'header'} container sx={styles.headerStyle}>
                <Grid container alignItems={'center'} sx={styles.header}>
                    <Grid item container xs alignItems={'center'}>
                        <Typography variant={'h4'} sx={styles.title}>
                            Payouts
                        </Typography>
                        <TextField
                            variant={'outlined'}
                            onChange={handleSearch}
                            value={search}
                            placeholder={'Search...'}
                            sx={styles.searchField}
                            InputProps={{
                                classes: {
                                    input: classes.searchFieldInput,
                                    notchedOutline: classes.searchFieldNotch,
                                },
                                startAdornment: (
                                    <InputAdornment position={'start'}>
                                        <SearchIcon color={'inherit'} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <LoadingButton
                        loading={loading}
                        variant={'contained'}
                        color={'primary'}
                        sx={styles.payoutButton}
                        disabled={pendingPayouts.length === 0}
                        onClick={() => handlePayCommission()}
                    >
                        Pay All Pending
                    </LoadingButton>
                </Grid>
                {tabs}
            </Grid>
        </>
    );
}
