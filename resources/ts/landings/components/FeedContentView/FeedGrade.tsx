import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { connectMenu } from 'react-instantsearch-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const FeedGradeDropdown = styled(Box)(
    {
        '.Select': {
            width: '100%',
            height: '40px',
            boxSizing: 'border-box',
            borderRadius: '24px',
            padding: '10px 10px',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
        },

        '.SelectFocus': {
            width: '100%',
            height: '40px',
            boxSizing: 'border-box',
            borderRadius: '24px',
            padding: '10px 10px',
            cursor: 'pointer',
            background: '#E3F0F6',
            color: '#20BFB8',
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
    { name: 'FeedGradeDropdown' },
);
const CustomMenuSelect = connectMenu(({ items, currentRefinement, refine }) => {
    const [className, changeClassName] = useState('Select');
    return (
        <>
            <Divider sx={{ margin: '0px 20px', height: '40px' }} orientation="vertical" flexItem />
            <FeedGradeDropdown>
                {!currentRefinement ? (
                    <Select
                        value={currentRefinement || 'Grade'}
                        onChange={(event) => refine(event.target.value)}
                        onFocus={() => {
                            changeClassName('SelectFocus');
                        }}
                        onBlur={() => {
                            changeClassName('Select');
                        }}
                        className={className}
                        onClose={() => {
                            changeClassName('Select');
                        }}
                    >
                        <MenuItem sx={{ display: 'none' }} value={'Grade'}>
                            Grade
                        </MenuItem>
                        {items.map((item: any) => (
                            <MenuItem key={item.label} value={item.isRefined ? currentRefinement : item.value}>
                                {item.label}
                            </MenuItem>
                        ))}
                    </Select>
                ) : (
                    <Chip
                        label={currentRefinement}
                        variant="outlined"
                        onDelete={(event) => {
                            event.preventDefault();
                            refine(event.currentTarget.value);
                        }}
                        deleteIcon={<CancelRoundedIcon sx={{ color: '#20BFB8!important', fontWeight: 'bold' }} />}
                        className={'RefineGradeChip'}
                    />
                )}
            </FeedGradeDropdown>
        </>
    );
});

export function FeedGrade() {
    const grade = useSelector((state: RootState) => state.feed.gradeValue.grade);

    return <CustomMenuSelect attribute={'grade'} defaultRefinement={grade} />;
}

export default FeedGrade;
