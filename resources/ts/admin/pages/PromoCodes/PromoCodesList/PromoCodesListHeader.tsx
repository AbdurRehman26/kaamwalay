import SearchIcon from '@mui/icons-material/Search';
import TabList from '@mui/lab/TabList';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import {
    setApplicables,
    setDiscountApplicationType,
    setShowNewPromoCodeDialog,
} from '@shared/redux/slices/adminNewPromoCodeSlice';
import { APIService } from '@shared/services/APIService';
import { font } from '@shared/styles/utils';
import { PromoCodeModal } from '@admin/pages/PromoCodes/PromoCodesList/PromoCodeModal';

interface PromoCodesListHeaderProps {
    onSearch?: (query: string) => void;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            backgroundColor: '#f9f9f9',
        },
        header: {
            padding: theme.spacing(3),
        },
        newPromoCodeBtn: {
            textTransform: 'uppercase',
            padding: '10px 20px',
            borderRadius: '24px',
        },
        searchField: {
            backgroundColor: '#fff',
            borderRadius: 24,
            marginLeft: theme.spacing(2),
        },
        searchFieldNotch: {
            borderRadius: 24,
        },
        searchFieldInput: {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(1.5),
            height: 24,
        },
    }),
    { name: 'PromoCodesListHeader' },
);

const debouncedFunc = debounce((func: any) => {
    func();
}, 300);

export function PromoCodesListHeader({ onSearch }: PromoCodesListHeaderProps) {
    const classes = useStyles();
    const dispatch = useSharedDispatch();
    const [search, setSearch] = useState('');
    const apiService = useInjectable(APIService);
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

    const onNewPromoCodePress = useCallback(async () => {
        const applicablesEndpoint = apiService.createEndpoint('/admin/coupon-applicables');
        const applicablesResponse = await applicablesEndpoint.get('');
        const applicables = applicablesResponse.data;
        dispatch(setDiscountApplicationType(applicables[0].code));
        dispatch(setApplicables(applicables));
        dispatch(setShowNewPromoCodeDialog(true));
    }, [apiService, dispatch]);

    return (
        <Grid component={'header'} container className={classes.root}>
            <PromoCodeModal />
            <Grid container alignItems={'center'} className={classes.header}>
                <Grid item container xs alignItems={'center'}>
                    <Typography variant={'h4'} className={font.fontWeightBold}>
                        Promo Codes
                    </Typography>
                    <TextField
                        variant={'outlined'}
                        onChange={handleSearch}
                        value={search}
                        placeholder={'Search...'}
                        className={classes.searchField}
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
                <Grid container item xs justifyContent={'flex-end'}>
                    <span>
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            onClick={onNewPromoCodePress}
                            className={classes.newPromoCodeBtn}
                        >
                            create promo code
                        </Button>
                    </span>
                </Grid>
            </Grid>
            <TabList indicatorColor={'primary'} textColor={'primary'}>
                <Tab component={Link} to={'/promo-codes/all/list'} value={'all'} label="All" />
                <Tab component={Link} to={'/promo-codes/active/list'} value={'active'} label="Active" />
                <Tab component={Link} to={'/promo-codes/inactive/list'} value={'inactive'} label="Inactive" />
            </TabList>
        </Grid>
    );
}

export default PromoCodesListHeader;
