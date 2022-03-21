import Chip from '@mui/material/Chip';
import React from 'react';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { connectCurrentRefinements } from 'react-instantsearch-dom';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
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

export function FeedCurrentFilter() {
    const CurrentRefinements = ({ items, refine }: { items: any; refine: any }) => (
        <CurrentRefinementBox>
            <ul className={'CurrentFilterList'}>
                {items.map((item: any) => (
                    <li key={item.label}>
                        {item.items ? (
                            <React.Fragment>
                                {item.items.map((nested: any) => (
                                    <Chip
                                        key={nested.label}
                                        label={nested.label}
                                        variant="outlined"
                                        onDelete={(event) => {
                                            event.preventDefault();
                                            refine(item.value);
                                        }}
                                        className={'Chip'}
                                        deleteIcon={
                                            <CancelRoundedIcon
                                                sx={{ color: '#20BFB8!important', fontWeight: 'bold' }}
                                            />
                                        }
                                    />
                                ))}
                            </React.Fragment>
                        ) : (
                            <Chip
                                key={item.label}
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

    const CustomCurrentRefinements = connectCurrentRefinements(CurrentRefinements);
    return <CustomCurrentRefinements />;
}

export default FeedCurrentFilter;
