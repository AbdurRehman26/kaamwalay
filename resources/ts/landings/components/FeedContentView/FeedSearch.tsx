import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import theme from '@shared/styles/theme';
import FeedCategories from './FeedCategories';
import FeedItemsPerPage from './FeedItemsPerPage';
import FeedPagination from './FeedPagination';

const BoxDiv = styled(Box)({
    '.FeedHero': {
        color: 'rgb(255, 255, 255)',
        backgroundImage: `url(/assets/images/feedpage-background.jpg)`,
        backgroundRepeat: 'round',
    },
    '.FeedContainer': {
        width: '100%',
        padding: '10px',
    },
    '.FeedHeroText': {
        padding: '30px 0',
    },
    '.FeedHeroHeading': {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: '48px',
        lineHeight: '56px',
        letterSpacing: '0.2px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '32px',
        },
    },
    '.FeedHeroSubHeading': {
        textAlign: 'center',
        fontSize: '16px',
    },
    '.FeedHeroSearchBox': {
        margin: 'auto',
        width: '43%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    '.searchBox': {
        marginBottom: '20px',
        width: '630px',
        padding: '8px 20px',
        borderRadius: '20px',
        color: '#000000',
        [theme.breakpoints.down('sm')]: {
            width: '360px',
        },
    },
});

const styles = {
    InputStyle: {
        width: '630px',
        padding: '10px 20px',
        borderRadius: '24px',
        color: '#000000',
        background: '#FFFFFF',

        [theme.breakpoints.down('sm')]: {
            width: '360px',
        },
    },

    ListView: {
        background: '#FFFFFF',
        paddingTop: '10px',
    },

    GridView: {
        background: 'none',
        paddingTop: '10px',
    },
};

const PaginationBox = styled(Container)({
    display: 'flex',
    padding: '20px 20px',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
        float: 'none',
    },
});

const CustomSearchBox = connectSearchBox(({ currentRefinement, refine }: { currentRefinement: any; refine: any }) => {
    const [query, setQuery] = useState('');
    const [background, setBackground] = useState(true);

    return (
        <>
            <BoxDiv>
                <Grid className={'FeedHero'}>
                    <Grid className={'FeedContainer'}>
                        <Grid className={'FeedHeroText'}>
                            <Typography className={'FeedHeroHeading'}>Robograding Feed</Typography>
                            <Typography className={'FeedHeroSubHeading'}>See all the cards we've graded.</Typography>
                        </Grid>
                        <Grid className={'FeedHeroSearchBox'}>
                            <Input
                                sx={styles.InputStyle}
                                placeholder="search..."
                                type="search"
                                value={currentRefinement}
                                onChange={(event) => {
                                    refine(event.currentTarget.value);
                                    setQuery(event.target.value);
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon />
                                    </InputAdornment>
                                }
                                disableUnderline
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </BoxDiv>
            <Box sx={background ? styles.GridView : styles.ListView}>
                <Container>
                    <FeedCategories query={query} setBackground={setBackground} />
                </Container>
                <PaginationBox sx={background ? styles.GridView : styles.ListView}>
                    <FeedItemsPerPage />
                    <FeedPagination />
                </PaginationBox>
            </Box>
        </>
    );
});

export function FeedSearch() {
    return <CustomSearchBox />;
}

export default FeedSearch;
