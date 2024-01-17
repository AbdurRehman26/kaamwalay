import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { connectHits } from 'react-instantsearch-dom';
import theme from '@shared/styles/theme';

const GridDiv = styled(Grid)({
    '.GridView': {
        width: '305px',
        height: '228px',
        background: 'rgba(239, 239, 246, 1)',
        borderRadius: '12px',
        flex: '1 1 auto',
        display: 'inline-flex',
        flexDirection: 'column',
        margin: '10px 10px',
        alignItems: 'center',
        '&:hover': {
            boxShadow:
                '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
        },
    },
    '.GridTopSection': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        borderBottom: '1px solid #E0E0E0',
        overflow: 'hidden',
    },
    '.GridImageSection': {
        padding: '10px 10px',
    },
    '.CardImage': {
        maxWidth: '200px',
        maxHeight: '200px',
    },
    '.GridSection': {
        display: 'flex',
        alignItems: 'stretch',
    },
    '.GridBottomSection': {
        width: '305px',
        padding: '10px 10px',
    },
    '.BottomSectionText': {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '20px',
        letterSpacing: '0.10px',
        textAlign: 'left',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '.BottomSectionContent': {
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '0.2px',
        textAlign: 'left',
    },
    '.VerifiedImage': {
        position: 'relative',
        left: '130px',
        top: '10px',
    },
    '.VerifiedImageDiv': {
        position: 'absolute',
    },
});
const BoxDiv = styled(Box)({
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
});

const CustomHits = connectHits(({ hits }) => {
    return (
        <GridDiv container>
            {hits.map((hit: any) => (
                <a href={`feed/${hit.certificate_number}/view`} key={hit.objectID}>
                    <div className={'GridView'}>
                        <Grid className={'VerifiedImageDiv'}>
                            <img className={'VerifiedImage'} src="/assets/images/verified.svg" alt={'verified'} />
                        </Grid>
                        <div className={'GridImageSection'}>
                            <img
                                className={'CardImage'}
                                src={!hit.front_slab_image ? hit.card_image : hit.front_slab_image}
                                alt={hit.card_name}
                            />
                        </div>
                    </div>
                    <div className={'GridBottomSection'}>
                        <div className={'GridSection'}>
                            <Typography className={'BottomSectionContent'}>
                                Daisy Ridley Signed Rey Funko Pop #73 Star Wars{' '}
                            </Typography>
                        </div>
                        <div className={'GridSection'}>
                            <Typography className={'BottomSectionText'}>C002820301</Typography>
                        </div>
                    </div>
                </a>
            ))}
        </GridDiv>
    );
});

export function AutographTiles() {
    return (
        <BoxDiv>
            <CustomHits />
        </BoxDiv>
    );
}

export default AutographTiles;
