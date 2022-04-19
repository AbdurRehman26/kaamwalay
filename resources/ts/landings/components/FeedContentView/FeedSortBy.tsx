import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { connectSortBy } from 'react-instantsearch-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { setSortByValue } from '../../redux/slices/feedSlice';
import { RootState } from '../../redux/store';

const FeedSortDropdown = styled(Box)(
    {
        '.Select': {
            width: '100%',
            height: '40px',
            padding: '10px',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        '.SelectFocus': {
            width: '100%',
            height: '40px',
            padding: '10px',
            cursor: 'pointer',
            color: '#20BFB8',
            '& .MuiSvgIcon-root': {
                color: '#20BFB8',
            },
        },
        '.SortText': {
            marginLeft: '10px',
            color: 'rgba(0, 0, 0, 0.54)',
        },
        '.SortTextSelected': {
            marginLeft: '10px',
            color: '#20BFB8',
        },
    },
    { name: 'FeedSortDropdown' },
);

const styles = {
    MenuItem: {
        color: '#000000',
        paddingRight: '50px',
        '&:hover': {
            backgroundColor: 'rgba(32, 191, 184, 0.12)',
        },
    },
    MenuItemSelected: {
        color: '#20BFB8',
        paddingRight: '50px',
        '&:hover': {
            backgroundColor: 'rgba(32, 191, 184, 0.12)',
        },
    },
};

const CustomSortBy = connectSortBy(({ items, refine, currentRefinement }) => {
    const [classN, changeClass] = useState('Select');
    const { appEnv } = useConfiguration();
    const sort = useSelector((state: RootState) => state.feed.sortState.sort);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const dispatch = useDispatch();

    return !isMobile ? (
        <FeedSortDropdown>
            {classN === 'Select' ? (
                <Typography className={'SortText'}>Sort</Typography>
            ) : (
                <Typography className={'SortTextSelected'}>Sort</Typography>
            )}
            <Select
                value={currentRefinement || `${appEnv}_user_cards`}
                onChange={(event) => refine(event.target.value)}
                variant={'standard'}
                onFocus={() => {
                    changeClass('SelectFocus');
                }}
                className={classN}
                disableUnderline
            >
                <MenuItem sx={{ display: 'none' }} value={`${appEnv}_user_cards`}>
                    Most Recent
                </MenuItem>
                {items.map((item: any) => (
                    <MenuItem
                        key={item.label}
                        sx={item.isRefined ? styles.MenuItemSelected : styles.MenuItem}
                        value={item.isRefined ? currentRefinement : item.value}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FeedSortDropdown>
    ) : (
        <ul>
            <RadioGroup>
                {items.map((item: any) => (
                    <FormControlLabel
                        checked={sort === item.value}
                        key={item.value}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                        onClick={(event) => {
                            event.preventDefault();
                            refine(item.value);
                            dispatch(setSortByValue(item.value));
                        }}
                    />
                ))}
            </RadioGroup>
        </ul>
    );
});

export function FeedSortBy() {
    const sort = useSelector((state: RootState) => state.feed.sortState.sort);
    const { appEnv } = useConfiguration();
    return (
        <CustomSortBy
            defaultRefinement={sort ? sort : `${appEnv}_user_cards`}
            items={[
                { value: `${appEnv}_user_cards`, label: 'Most Recent' },
                { value: `${appEnv}_user_cards_Ascending`, label: 'Oldest' },
            ]}
        />
    );
}

export default FeedSortBy;
