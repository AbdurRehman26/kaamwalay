import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { connectSearchBox } from 'react-instantsearch-dom';
import theme from '@shared/styles/theme';
import AutographItemsPerPage from './AutographItemsPerPage';
import AutographSortBy from './AutographSortBy';
import AutographTiles from './AutographTiles';

const BoxDiv = styled(Box)({
    '.AutographHero': {
        color: 'rgb(255, 255, 255)',
        backgroundImage: `url(/assets/images/autograph-background.png)`,
        height: '500px',
        textAlign: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
    },
    '.AutographOverlay': {
        display: 'flex',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        height: '500px',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    '.AutographContainer': {
        width: '100%',
        padding: '10px',
    },
    '.AutographHeroText': {
        padding: '30px 0',
    },
    '.AutographHeroHeading': {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: 900,
        fontSize: '50px',
        lineHeight: '64px',
        letterSpacing: '0.2px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '32px',
        },
    },
    '.AutographHeroSubHeading': {
        textAlign: 'center',
        fontSize: '16px',
        width: '24%',
        padding: '10px',
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    '.AutographHeroSearchBox': {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    '.AutographInnerSearchBox': {
        background: '#fff',
        color: '#000',
        padding: '35px 50px',
        borderRadius: '20px',
        position: 'absolute',
        top: '420px',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
    },
    '.AutographSearchText': {
        fontSize: '20px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '0.5px',
        textAlign: 'center',
        paddingBottom: '20px',
    },
    '.searchBox': {
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
        width: '550px',
        padding: '10px 20px',
        borderRadius: '24px',
        color: '#000000',
        background: '#FFFFFF',
        border: '1px solid rgba(204, 204, 204, 1)',

        [theme.breakpoints.down('sm')]: {
            width: '360px',
        },
    },
    ImageStyle: {
        display: 'flex',
        alignItem: 'center',
        justifyContent: 'center',
    },

    GridView: {
        background: '#FFFFFF',
        paddingTop: '10px',
    },
};

const PaginationBox = styled(Container)({
    display: 'flex',
    padding: '15px 15px',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
        float: 'none',
    },
});

const CustomSearchBox = connectSearchBox(({ currentRefinement, refine }: { currentRefinement: any; refine: any }) => {
    return (
        <>
            <BoxDiv>
                <Grid className={'AutographHero'}>
                    <Grid className={'AutographOverlay'}>
                        <Grid className={'AutographContainer'}>
                            <Grid className={'AutographHeroText'}>
                                <Grid sx={styles.ImageStyle}>
                                    <img width={100} src="/assets/images/hero-logo.png" alt={'hero-logo'} />
                                </Grid>
                                <Typography className={'AutographHeroHeading'}>Autograph Authentication</Typography>
                                <Typography className={'AutographHeroSubHeading'}>
                                    AGS has partnered up with SpeedyComics to bring you the most reliable Autograph
                                    authentication in the world.
                                </Typography>
                            </Grid>
                            <Grid className={'AutographHeroSearchBox'}>
                                <Grid className={'AutographInnerSearchBox'}>
                                    <Typography className={'AutographSearchText'}>
                                        SEARCH TO VERIFY AUTHENTICITY
                                    </Typography>
                                    <Input
                                        sx={styles.InputStyle}
                                        placeholder="Search by certificate # or keywords..."
                                        type="search"
                                        value={currentRefinement}
                                        onChange={(event) => {
                                            refine(event.currentTarget.value);
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
                    </Grid>
                </Grid>
            </BoxDiv>
            <Box sx={styles.GridView}>
                <Container sx={{ marginTop: '10%' }}>
                    <Grid
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            marginBottom: '20px',
                        }}
                    >
                        <AutographSortBy />
                    </Grid>
                    <Divider sx={{ marginBottom: '20px' }} orientation="horizontal" flexItem />
                    <AutographTiles />
                </Container>
                <PaginationBox sx={styles.GridView}>
                    <AutographItemsPerPage />
                </PaginationBox>
            </Box>
        </>
    );
});

export function AutographAuthenticationSearch() {
    return <CustomSearchBox />;
}

export default AutographAuthenticationSearch;
