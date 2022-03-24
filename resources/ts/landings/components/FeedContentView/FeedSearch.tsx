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

const BoxDiv = styled(Box)({
    '.FeedHero': {
        color: 'rgb(255, 255, 255)',
        backgroundImage: `url(/assets/images/feedpage-background.png)`,
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
        width: '630px',
        padding: '10px 20px',
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
};

const CustomSearchBox = connectSearchBox(({ currentRefinement, refine }: { currentRefinement: any; refine: any }) => {
    const [query, setQuery] = useState('');

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
            <Container>
                <FeedCategories query={query} />
            </Container>
        </>
    );
});

export function FeedSearch() {
    return <CustomSearchBox />;
}

export default FeedSearch;
