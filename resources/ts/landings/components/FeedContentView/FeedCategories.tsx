import { connectRefinementList } from 'react-instantsearch-dom';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import DoneIcon from '@mui/icons-material/Done';
import { FeedGridView } from './FeedGridView';
import { FeedListView } from './FeedListView';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import DensitySmallOutlinedIcon from '@mui/icons-material/DensitySmallOutlined';
import { useState } from 'react';
import FeedClearCategories from './FeedClearCategories';
import FeedSortBy from './FeedSortBy';
import { FeedGrade } from './FeedGrade';
import FeedResultCount from './FeedResultCount';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const FeeCategoryBox = styled(Box)(
    {
        margin: '10px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',

        '.GradeList': {
            display: 'inline-flex',
        },
        '.CategoryChip': {
            width: '100%',
            height: '40px',
            background: '#F4F4FB',
            border: '1px solid rgba(0, 0, 0, 0.18)',
            boxSizing: 'border-box',
            borderRadius: '24px',
            padding: '10px 10px',
            cursor: 'pointer',
        },
        '.GradeListItem': {
            marginLeft: '10px',
        },
        '.FilterBar': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
        },
        '.GridViewButton': {
            cursor: 'pointer',
        },
        '.ListViewButton': {
            cursor: 'pointer',
        },
    },
    { name: 'FeeCategoryBox' },
);

export function FeedCategories() {
    const [toggleView, setToggleView] = useState(true);
    const RefinementList = ({ items, refine, createURL }) => (
        <Grid>
            <ul className={'GradeList'}>
                <li>
                    <FeedClearCategories />
                </li>
                {items.map((item) => (
                    <li className={'GradeListItem'} key={item.label}>
                        <a
                            href={createURL(item.value)}
                            onClick={(event) => {
                                event.preventDefault();
                                refine(item.value);
                            }}
                        >
                            <Chip
                                style={{
                                    border: item.isRefined ? '1px solid #20BFB8' : '',
                                    background: item.isRefined ? 'rgba(32, 191, 184, 0.08)' : '',
                                }}
                                className={'CategoryChip'}
                                icon={<DoneIcon />}
                                label={item.label}
                                variant="outlined"
                            />
                        </a>
                    </li>
                ))}
            </ul>
        </Grid>
    );
    const CustomRefinementList = connectRefinementList(RefinementList);

    return (
        <>
            <FeeCategoryBox>
                <Grid className={'FilterBar'}>
                    <CustomRefinementList attribute={'card_category'} />
                    <FeedGrade />
                </Grid>
                <Grid className={'FilterBar'}>
                    <Grid>
                        <DensitySmallOutlinedIcon className={'ListViewButton'} onClick={() => setToggleView(false)} />
                        <GridViewOutlinedIcon className={'GridViewButton'} onClick={() => setToggleView(true)} />
                    </Grid>
                    <Grid>
                        <FeedSortBy />
                    </Grid>
                </Grid>
            </FeeCategoryBox>
            <FeedResultCount />
            {toggleView ? <FeedGridView /> : <FeedListView />}
        </>
    );
}

export default FeedCategories;
