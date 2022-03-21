import { connectMenu } from 'react-instantsearch-dom';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const FeedGradeDropdown = styled(Box)(
    {
        '.Select': {
            width: '100%',
            height: '40px',
            background: '#F4F4FB',
            boxSizing: 'border-box',
            borderRadius: '24px',
            padding: '10px 10px',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
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

export function FeedGrade() {
    const MenuSelect = ({ items, currentRefinement, refine }: { items: any; currentRefinement: any; refine: any }) => (
        <>
            <Divider sx={{ margin: '0px 20px', height: '40px' }} orientation="vertical" flexItem />
            <FeedGradeDropdown>
                {!currentRefinement ? (
                    <Select
                        value={currentRefinement || 'Grade'}
                        onChange={(event) => refine(event.target.value)}
                        className={'Select'}
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

    const CustomMenuSelect = connectMenu(MenuSelect);
    return <CustomMenuSelect attribute={'grade'} />;
}

export default FeedGrade;
