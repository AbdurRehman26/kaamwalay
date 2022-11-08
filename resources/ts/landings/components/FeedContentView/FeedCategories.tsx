import DensitySmallOutlinedIcon from '@mui/icons-material/DensitySmallOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import { useDispatch, useSelector } from 'react-redux';
import theme from '@shared/styles/theme';
import { removeCategoryValue, setCategoryValue } from '../../redux/slices/feedSlice';
import { RootState } from '../../redux/store';
import FeedClearCategories from './FeedClearCategories';
import FeedCurrentFilters from './FeedCurrentFilters';
import { FeedGrade } from './FeedGrade';
import { FeedGridView } from './FeedGridView';
import { FeedListView } from './FeedListView';
import FeedMobileView from './FeedMobileView';
import FeedResultCount from './FeedResultCount';
import FeedSortBy from './FeedSortBy';

const FeeCategoryBox = styled(Box)(
    {
        margin: '10px 10px 0px',
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
        '.ViewOptionContainer': {
            display: 'inline-flex',
        },
        '.Select': {
            width: '100%',
            height: '40px',
            boxSizing: 'border-box',
            borderRadius: '24px',
            padding: '10px 10px',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
        },

        '.SelectCategoryFocus': {
            width: '100%',
            height: '40px',
            boxSizing: 'border-box',
            borderRadius: '24px',
            padding: '10px 10px',
            cursor: 'pointer',
            background: '#E3F0F6',
            color: '#20BFB8',

            '& .MuiSvgIcon-root': {
                color: '#20BFB8',
            },
        },

        '.RefineGradeChip': {
            width: '100%',
            height: '40px',
            background: 'rgba(32, 191, 184, 0.08)',
            border: '1px solid #20BFB8',
            boxSizing: 'border-box',
            borderRadius: '24px',
            padding: '10px 10px',
            cursor: 'pointer',
            color: '#20BFB8',
            fontWeight: 'bold',
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
    MenuItem: {
        '&:hover': {
            backgroundColor: 'rgba(32, 191, 184, 0.12)',
        },
    },
    NotSelectedText: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    SelectedText: {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: '#20BFB8',
    },
};

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: '260px',
            borderRadius: '8px',
            marginLeft: '60px',
        },
    },
};

const CustomRefinementList = connectRefinementList(({ items, refine }) => {
    const [className, changeClassName] = useState('Select');
    const dispatch = useDispatch();

    return (
        <ul className={'GradeList'}>
            <li>
                <Select
                    value={['Category']}
                    multiple
                    onFocus={() => {
                        changeClassName('SelectCategoryFocus');
                    }}
                    onBlur={() => {
                        changeClassName('Select');
                    }}
                    onClose={() => {
                        changeClassName('Select');
                    }}
                    className={className}
                    MenuProps={MenuProps}
                >
                    <MenuItem sx={{ display: 'none' }} value={'Category'}>
                        Category
                    </MenuItem>
                    {items.map((item: any) => (
                        <MenuItem
                            key={item.objectID}
                            value={item.label}
                            sx={styles.MenuItem}
                            onClick={(event) => {
                                refine(item.value);
                                event.preventDefault();
                                !item.isRefined
                                    ? dispatch(setCategoryValue(item.label))
                                    : dispatch(removeCategoryValue(item.label));
                            }}
                        >
                            <Typography sx={item.isRefined ? styles.SelectedText : styles.NotSelectedText}>
                                <Checkbox checked={item.isRefined ? true : false} />
                                {item.label}
                            </Typography>
                        </MenuItem>
                    ))}
                </Select>
            </li>
        </ul>
    );
});

export function FeedCategories({ query, setBackground }: { query: any; setBackground: any }) {
    const [toggleView, setToggleView] = useState(true);
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const category: Array<string> = useSelector((state: RootState) => state.feed.categoryValue.category);

    return (
        <>
            <FeeCategoryBox>
                <Grid className={'FilterBar'}>
                    <CustomRefinementList attribute={'card_category'} defaultRefinement={category} limit={100} />
                    <FeedGrade />
                    <FeedClearCategories />
                </Grid>
                <Grid className={'FilterBar'}>
                    <Grid className={'ViewOptionContainer'}>
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
            {!isSm && category.length > 0 ? <FeedCurrentFilters /> : null}
            <Grid sx={styles.MobileDiv}>
                <FeedResultCount query={query} />
                {isSm ? <FeedMobileView /> : ''}
            </Grid>
            {isSm ? (
                <Grid sx={{ borderBottom: '1px solid #E0E0E0' }}>
                    <FeedCurrentFilters />
                </Grid>
            ) : null}
            {toggleView ? <FeedGridView /> : <FeedListView />}
            {isSm ? <FeedListView /> : ''}
        </>
    );
}

export default FeedCategories;
