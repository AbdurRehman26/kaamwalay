import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback } from 'react';
import { connectStateResults, Hits, Stats } from 'react-instantsearch-dom';
import ManageCardDialogResultItem from './ManageCardDialogResultItem';
import ManageCardDialogResultsPagination from './ManageCardDialogResultsPagination';
import Typography from '@mui/material/Typography';
import { font } from '@shared/styles/utils';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useAppDispatch } from '@admin/redux/hooks';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';
import { Paper } from '@mui/material';

const useStyles = makeStyles(
    (theme) => ({
        noResultsContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '36px',
            width: '100%',
        },
        root: {
            marginTop: theme.spacing(3),
            '& .ais-Hits-item': {
                listStyleType: 'none',
            },
            '& .ais-Hits-list': {
                padding: 0,
                margin: 0,
            },
            '& .ais-Hits': {
                border: '1px solid #e0e0e0',
                maxHeight: 420,
                overflowY: 'auto',
                marginBottom: theme.spacing(3),
            },
            '& .ais-Stats-text': {
                fontSize: 12,
                fontWeight: 500,
                fontFamily: theme.typography.fontFamily,
                marginBottom: theme.spacing(1),
            },
        },
    }),
    { name: 'ManageCardDialogResults' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ManageCardDialogResults
 * @date: 13.09.2021
 * @time: 23:44
 */
const ManageCardDialogResults = connectStateResults(({ searchResults }) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const hasResults = searchResults && searchResults.nbHits !== 0;

    const handleCreateNewCard = useCallback(() => {
        dispatch(manageCardDialogActions.backup());
        dispatch(manageCardDialogActions.setView(ManageCardDialogViewEnum.Create));
    }, []);

    return (
        <div className={classes.root}>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Stats translations={{ stats: (nbHits) => `${nbHits} Results` }} />
                <Box>
                    <Typography variant={'caption'} className={font.fontWeightNormal}>
                        Can't find card?
                    </Typography>
                    <Button color={'primary'} variant="text" sx={{ fontSize: '12px' }} onClick={handleCreateNewCard}>
                        CREATE A NEW CARD
                    </Button>
                </Box>
            </Box>

            {hasResults ? (
                <>
                    <Hits hitComponent={ManageCardDialogResultItem} />
                    <ManageCardDialogResultsPagination />
                </>
            ) : (
                <Paper variant={'outlined'} className={classes.noResultsContainer}>
                    <Typography variant={'caption'} className={font.fontWeightNormal}>
                        No results found
                    </Typography>
                    <Button
                        color={'primary'}
                        variant="contained"
                        sx={{ fontSize: '12px', marginTop: '6px' }}
                        onClick={handleCreateNewCard}
                    >
                        CREATE A NEW CARD
                    </Button>
                </Paper>
            )}
        </div>
    );
});

export default ManageCardDialogResults;
