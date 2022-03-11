import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../redux/hooks';
import { SearchResultItemCardProps } from '../redux/slices/newSubmissionSlice';
import SearchResultItemCard from './SearchResultItemCard';
import { styled } from '@mui/material/styles';

const styles = {
    label: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
};

function AddedSubmissionCardsMobileSearchView() {
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);

    if (selectedCards.length === 0) {
        return null;
    }

    return (
        <>
            <TitleContainer>
                <Typography variant={'subtitle2'} sx={styles.label}>
                    Added Cards
                </Typography>
            </TitleContainer>
            {selectedCards.map((row: SearchResultItemCardProps) => (
                <>
                    <MobileViewListContainer>
                        <div title={row.shortName || row.name}>
                            <SearchResultItemCard
                                key={row.id}
                                id={row.id}
                                image={row.image}
                                longName={row.longName}
                                shortName={row.shortName}
                                name={row.name}
                                addedMode
                                reviewMode={true}
                            />
                        </div>
                    </MobileViewListContainer>
                    <Divider light />
                </>
            ))}
        </>
    );
}

export default AddedSubmissionCardsMobileSearchView;

const TitleContainer = styled('div')(
    {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 36,
    },
    { name: 'TitleContainer' },
);

const MobileViewListContainer = styled('div')(
    {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 12,
    },
    { name: 'MobileViewListContainer' },
);
