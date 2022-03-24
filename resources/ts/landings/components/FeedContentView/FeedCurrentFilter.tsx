import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { uniqBy } from 'lodash';
import React from 'react';
import { connectCurrentRefinements } from 'react-instantsearch-dom';
import theme from '@shared/styles/theme';

const CurrentRefinementBox = styled(Box)(
    {
        [theme.breakpoints.up('lg')]: {
            display: 'none',
        },
        '.CurrentFilterList': {
            display: 'inline-flex',
        },
        '.Chip': {
            width: '100%',
            height: '40px',
            background: 'rgba(32, 191, 184, 0.08)',
            border: '1px solid #20BFB8',
            boxSizing: 'border-box',
            borderRadius: '24px',
            cursor: 'pointer',
            color: '#20BFB8',
            fontWeight: 'bold',
        },
    },
    { name: 'CurrentRefinementBox' },
);

const CustomCurrentRefinements = connectCurrentRefinements(({ items, refine }) => {
    const uniqItems = uniqBy(
        items.map((item) => {
            if (item.items) {
                item.items = uniqBy(item.items, 'label');
            }

            return item;
        }),
        'label',
    );

    return (
        <CurrentRefinementBox>
            <ul className={'CurrentFilterList'}>
                {uniqItems.map((item: any) => (
                    <li key={item.value}>
                        {item.items ? (
                            item.items.map((nested: any) => (
                                <Chip
                                    key={item.label + '-chip-' + nested.label}
                                    label={nested.label}
                                    variant="outlined"
                                    onDelete={(event) => {
                                        event.preventDefault();
                                        refine(item.value);
                                    }}
                                    className={'Chip'}
                                    deleteIcon={
                                        <CancelRoundedIcon
                                            sx={{
                                                color: '#20BFB8!important',
                                                fontWeight: 'bold',
                                            }}
                                        />
                                    }
                                />
                            ))
                        ) : (
                            <Chip
                                key={item.value}
                                label={item.label.replace('grade:', '')}
                                variant="outlined"
                                onDelete={(event) => {
                                    event.preventDefault();
                                    refine(item.value);
                                }}
                                className={'Chip'}
                                deleteIcon={
                                    <CancelRoundedIcon sx={{ color: '#20BFB8!important', fontWeight: 'bold' }} />
                                }
                            />
                        )}
                    </li>
                ))}
            </ul>
        </CurrentRefinementBox>
    );
});

export function FeedCurrentFilter() {
    return <CustomCurrentRefinements />;
}

export default FeedCurrentFilter;
