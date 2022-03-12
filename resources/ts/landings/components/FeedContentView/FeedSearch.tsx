import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { connectSearchBox } from 'react-instantsearch-dom';
import { styled } from '@mui/material/styles';

const BoxDiv = styled(Box)({
    '.FeedHero': {
        color: 'rgb(255, 255, 255)',
        backgroundImage: `url(${'/assets/images/feedpage-background.png'})`,
        backgroundRepeat: 'round',
    },
    '.FeedContainer': {
        width: '100%',
        padding: '10px',
    },
    '.FeedHeroText': {
        padding: '24px 0',
    },
    '.FeedHeroHeading': {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: '48px',
        lineHeight: '56px',
        letterSpacing: '0.2px',
        marginBottom: '4px',
    },
    '.FeedHeroSubHeading': {
        textAlign: 'center',
        fontSize: '16px',
    },
    '.FeedHeroSearchBox': {
        margin: 'auto',
        width: '50%',
    },
});
const SearchBox = ({ currentRefinement, refine }) => (
    <form noValidate role="search">
        <input
            style={{
                width: '630px',
                padding: '10px 20px',
                borderRadius: '20px',
                color: '#000000',
            }}
            placeholder="search..."
            type="search"
            value={currentRefinement}
            onChange={(event) => refine(event.currentTarget.value)}
        />
    </form>
);
const CustomSearchBox = connectSearchBox(SearchBox);
export function FeedSearch() {
    return (
        <BoxDiv>
            <Grid className={'FeedHero'}>
                <Grid className={'FeedContainer'}>
                    <Grid className={'FeedHeroText'}>
                        <Typography className={'FeedHeroHeading'}>Robograding Feed</Typography>
                        <Typography className={'FeedHeroSubHeading'}>See all the cards we've graded.</Typography>
                        <Grid className={'FeedHeroSearchBox'}>
                            <CustomSearchBox />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </BoxDiv>
    );
}

export default FeedSearch;
