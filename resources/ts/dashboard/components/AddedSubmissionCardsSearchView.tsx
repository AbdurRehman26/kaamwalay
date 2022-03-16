import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../redux/hooks';
import { SearchResultItemCardProps } from '../redux/slices/newSubmissionSlice';
import SearchResultItemCard from './SearchResultItemCard';
import { styled } from '@mui/material/styles';
import { Fragment } from 'react';

function AddedSubmissionCardsMobileSearchView() {
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);

    if (selectedCards.length === 0) {
        return null;
    }

    return (
        <SearchListRoot>
            <div className={'SearchList-Title'}>
                <Typography variant={'subtitle1'} fontWeight={500}>
                    Added Cards
                </Typography>
            </div>
            {selectedCards.map((row: SearchResultItemCardProps) => (
                <Fragment key={row.id}>
                    <div className={'SearchList-Container'}>
                        <div title={row.shortName || row.name}>
                            <SearchResultItemCard
                                key={row.id}
                                id={row.id}
                                image={row.image}
                                longName={row.longName}
                                shortName={row.shortName}
                                name={row.name}
                                addedMode
                                reviewMode
                            />
                        </div>
                    </div>
                    <Divider light />
                </Fragment>
            ))}
        </SearchListRoot>
    );
}

export default AddedSubmissionCardsMobileSearchView;

const SearchListRoot = styled('div')(
    {
        '.SearchList-Title': {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 36,
        },
        '.SearchList-Container': {
            display: 'flex',
            flexDirection: 'column',
            marginTop: 12,
        },
    },
    { name: 'SearchListRoot' },
);
