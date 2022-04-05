import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { useAppSelector } from '../redux/hooks';
import { SearchResultItemCardProps } from '../redux/slices/newSubmissionSlice';
import SearchResultItemCard from './SearchResultItemCard';

function AddedSubmissionCardsMobileSearchView() {
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);

    if (selectedCards.length === 0) {
        return null;
    }

    return (
        <>
            <Grid container alignItems={'center'} mt={4.5}>
                <Typography variant={'subtitle1'} fontWeight={500}>
                    Added Cards
                </Typography>
            </Grid>
            {selectedCards.map((row: SearchResultItemCardProps) => (
                <Fragment key={row.id}>
                    <Stack mt={1.5} title={row.shortName || row.name}>
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
                    </Stack>
                    <Divider light />
                </Fragment>
            ))}
        </>
    );
}

export default AddedSubmissionCardsMobileSearchView;
