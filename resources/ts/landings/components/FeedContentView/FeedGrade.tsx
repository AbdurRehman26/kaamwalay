import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { connectMenu } from 'react-instantsearch-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterIncrement, setGradeTeal, setGradeValue } from '../../redux/slices/feedSlice';
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
    { name: 'FeedGradeDropdown' },
);

const styles = {
    MenuItem: {
        '&:hover': {
            backgroundColor: 'rgba(32, 191, 184, 0.12)',
        },
    },
};

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: '260px',
            borderRadius: '8px',
        },
    },
};

const CustomMenuSelect = connectMenu(({ items, currentRefinement, refine }) => {
    const [className, changeClassName] = useState('Select');
    const getGrade = (item: Record<string, any>) => Number(item.label.split(' ').pop());
    const grades = items.sort((a, b) => getGrade(b) - getGrade(a));
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const dispatch = useDispatch();

    return !isMobile ? (
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
                        onClose={() => {
                            changeClassName('Select');
                        }}
                        className={className}
                        MenuProps={MenuProps}
                    >
                        <MenuItem sx={{ display: 'none' }} value={'Grade'}>
                            Grade
                        </MenuItem>
                        {grades.map((item: any) => (
                            <MenuItem
                                sx={styles.MenuItem}
                                key={item.label}
                                value={item.isRefined ? currentRefinement : item.value}
                            >
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
    ) : (
        <ul>
            <RadioGroup>
                {grades.map((item: any) => (
                    <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio checked={item.isRefined} />}
                        label={item.label}
                        onClick={(event) => {
                            event.preventDefault();
                            refine(item.value);
                            dispatch(setGradeValue(item.value));
                            dispatch(setFilterIncrement());
                            dispatch(setGradeTeal(true));
                        }}
                    />
                ))}
            </RadioGroup>
        </ul>
    );
});

export function FeedGrade() {
    const grade = useSelector((state: RootState) => state.feed.gradeValue.grade);

    return <CustomMenuSelect attribute={'grade'} defaultRefinement={grade} limit={20} />;
}

export default FeedGrade;
