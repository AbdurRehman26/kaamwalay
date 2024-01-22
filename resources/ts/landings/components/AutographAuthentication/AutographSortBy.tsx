import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { connectSortBy } from 'react-instantsearch-dom';
import { useConfiguration } from '@shared/hooks/useConfiguration';

const AutographSortDropdown = styled(Box)(
    {
        '.Select': {
            border: '1px solid rgba(0, 0, 0, 0.18)',
            borderRadius: '24px',
            padding: '5px 20px',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        '.SelectFocus': {
            border: '1px solid',
            borderRadius: '24px',
            padding: '5px 20px',
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
    { name: 'AutographSortDropdown' },
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

    return (
        <AutographSortDropdown>
            <Select
                value={currentRefinement || `${appEnv}_autograph_products`}
                onChange={(event) => refine(event.target.value)}
                variant={'standard'}
                onFocus={() => {
                    changeClass('SelectFocus');
                }}
                className={classN}
                disableUnderline
            >
                <MenuItem sx={{ display: 'none' }} value={`${appEnv}_autograph_products`}>
                    Most Recent
                </MenuItem>
                {items.map((item: any) => (
                    <MenuItem
                        key={item.label}
                        sx={item.isRefined ? styles.MenuItemSelected : styles.MenuItem}
                        value={item.isRefined ? currentRefinement : item.value}
                    >
                        Sort: {item.label}
                    </MenuItem>
                ))}
            </Select>
        </AutographSortDropdown>
    );
});

export function AutographSortBy() {
    const { appEnv } = useConfiguration();
    return (
        <CustomSortBy
            defaultRefinement={`${appEnv}_autograph_products:created_at_timestamp:desc`}
            items={[
                { value: `${appEnv}_autograph_products:created_at_timestamp:desc`, label: 'Most Recent' },
                { value: `${appEnv}_autograph_products:created_at_timestamp:asc`, label: 'Oldest' },
            ]}
        />
    );
}

export default AutographSortBy;
