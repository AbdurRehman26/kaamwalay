import DensitySmallOutlinedIcon from '@mui/icons-material/DensitySmallOutlined';
import DoneIcon from '@mui/icons-material/Done';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import { useSelector } from 'react-redux';
import theme from '@shared/styles/theme';
import { RootState } from '../../redux/store';
import FeedClearCategories from './FeedClearCategories';
import FeedCurrentFilter from './FeedCurrentFilter';
import { FeedGrade } from './FeedGrade';
import { FeedGridView } from './FeedGridView';
import { FeedListView } from './FeedListView';
import FeedMobileView from './FeedMobileView';
import FeedResultCount from './FeedResultCount';
import FeedSortBy from './FeedSortBy';

const FeeCategoryBox = styled(Box)(
    {
        margin: '10px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },

        '.GradeList': {
            display: 'inline-flex',
            flexWrap: 'wrap',
            gap: '0.5em',
        },
        '.CategoryChipSelected': {
            width: '100%',
            height: '40px',
            boxSizing: 'border-box',
            borderRadius: '24px',
            padding: '10px 10px',
            cursor: 'pointer',
            border: '1px solid #20BFB8',
            backgroundColor: 'rgba(32, 191, 184, 0.08)',
            color: '#20BFB8',
            fontWeight: 'bold',
        },
        '.CategoryChip': {
            width: '100%',
            height: '40px',
            border: '1px solid rgba(0, 0, 0, 0.18)',
            boxSizing: 'border-box',
            borderRadius: '24px',
            padding: '10px 10px',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
        },
        '.FilterBar': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
        },
        '.GridViewButton': {
            margin: '8px',
            cursor: 'pointer',
        },
        '.GridViewButtonActive': {
            cursor: 'pointer',
            background: '#DCDCDC',
            fontSize: '40px',
            padding: '8px',
            borderRadius: '17px',
            color: 'rgba(0, 0, 0, 0.38)',
        },
        '.ListViewButton': {
            margin: '8px 8px',
            cursor: 'pointer',
        },
        '.ListViewButtonActive': {
            background: '#DCDCDC',
            margin: '0px 8px',
            cursor: 'pointer',
            fontSize: '40px',
            padding: '10px',
            borderRadius: '17px',
            color: 'rgba(0, 0, 0, 0.38)',
        },
    },
    { name: 'FeeCategoryBox' },
);

const styles = {
    MobileDiv: {
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            padding: '10px 0px',
        },
    },
};

const CustomRefinementList = connectRefinementList(({ items, refine, createURL }) => {
    return (
        <ul className={'GradeList'}>
            <li>
                <FeedClearCategories />
            </li>
            {items.map((item: any) => (
                <li className={'GradeListItem'} key={item.label}>
                    <a
                        key={item.objectID}
                        href={createURL(item.value)}
                        onClick={(event) => {
                            refine(item.value);
                            event.preventDefault();
                        }}
                    >
                        {item.isRefined ? (
                            <Chip
                                className={'CategoryChipSelected'}
                                icon={<DoneIcon sx={{ color: '#20BFB8!important', fontWeight: 'bold' }} />}
                                label={item.label}
                                variant="outlined"
                            />
                        ) : (
                            <Chip className={'CategoryChip'} label={item.label} variant="outlined" />
                        )}
                    </a>
                </li>
            ))}
        </ul>
    );
});

export function FeedCategories({ query, setBackground }: { query: any; setBackground: any }) {
    const [toggleView, setToggleView] = useState(true);
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const category = useSelector((state: RootState) => state.feed.categoryValue.category);

    return (
        <>
            <FeeCategoryBox>
                <Grid className={'FilterBar'}>
                    {category ? (
                        <CustomRefinementList attribute={'card_category'} defaultRefinement={[category]} />
                    ) : (
                        <CustomRefinementList attribute={'card_category'} />
                    )}
                    <FeedGrade />
                </Grid>
                <Grid className={'FilterBar'}>
                    <Grid>
                        <DensitySmallOutlinedIcon
                            className={toggleView ? 'ListViewButton' : 'ListViewButtonActive'}
                            onClick={() => {
                                setToggleView(false);
                                setBackground(false);
                            }}
                        />
                        <GridViewOutlinedIcon
                            className={toggleView ? 'GridViewButtonActive' : 'GridViewButton'}
                            onClick={() => {
                                setToggleView(true);
                                setBackground(true);
                            }}
                        />
                    </Grid>
                    <Divider sx={{ margin: '10px', height: '50px' }} orientation="vertical" flexItem />
                    <Grid>
                        <FeedSortBy />
                    </Grid>
                </Grid>
            </FeeCategoryBox>
            <Grid sx={styles.MobileDiv}>
                <FeedResultCount query={query} />
                {isSm ? <FeedMobileView /> : ''}
            </Grid>
            {isSm ? (
                <Grid sx={{ borderBottom: '1px solid #E0E0E0' }}>
                    <FeedCurrentFilter />
                </Grid>
            ) : null}
            {toggleView ? <FeedGridView /> : <FeedListView />}
            {isSm ? <FeedListView /> : ''}
        </>
    );
}

export default FeedCategories;
