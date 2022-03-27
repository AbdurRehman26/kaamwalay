import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { connectHits } from 'react-instantsearch-dom';
import { BrowserRouter, Link } from 'react-router-dom';
import theme from '@shared/styles/theme';

const GridDiv = styled(Grid)({
    '.GridView': {
        width: '300px',
        height: '411px',
        background: '#ffffff',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        flex: '1 1 auto',
        display: 'inline-flex',
        flexDirection: 'column',
        margin: '10px 4px',
        alignItems: 'center',
    },
    '.GridTopSection': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        borderBottom: '1px solid #E0E0E0',
    },
    '.GridTextSection': {
        padding: '10px 10px',
    },
    '.CardName': {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CardLongName': {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.GridGradeSection': {
        padding: '5px 5px',
        margin: '10px 10px',
        minWidth: '20%',
        height: '60px',
        background: '#20bfb8',
        borderRadius: '4px',
    },
    '.GradeNickName': {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '12px',
        textAlign: 'center',
        color: '#ffffff',
        marginTop: '5px',
    },
    '.OverallGrade': {
        fontStyle: 'normal',
        fontWeight: '900',
        fontSize: '24px',
        lineHeight: '24px',
        textAlign: 'center',
        color: '#ffffff',
        padding: '6px',
    },
    '.GridImageSection': {
        padding: '10px 10px',
    },
    '.CardImage': {
        width: '170.66px',
        height: '237.78px',
    },
    '.GridSection': {
        display: 'flex',
        alignItems: 'stretch',
    },
    '.GridBottomSection': {
        width: '100%',
        padding: '10px 10px',
        borderTop: '1px solid #E0E0E0',
    },
    '.BottomSectionText': {
        marginLeft: '5px',
        fontStyle: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: '#000000',
    },
    '.BottomSectionContent': {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
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
                <Link to={`feed/${hit.certificate_number}/view`} key={hit.objectID}>
                    <div className={'GridView'}>
                        <div className={'GridTopSection'}>
                            <div className={'GridTextSection'}>
                                <Typography className={'CardName'}>{hit.card_name}</Typography>
                                <Typography className={'CardLongName'}>{hit.searchable_name}</Typography>
                            </div>
                            <div className={'GridGradeSection'}>
                                <Typography className={'GradeNickName'}>{hit.grade_nickname}</Typography>
                                <Typography className={'OverallGrade'}>{hit.overall_grade}</Typography>
                            </div>
                        </div>
                        <div className={'GridImageSection'}>
                            <img className={'CardImage'} src={hit.card_image} alt={hit.card_name} />
                        </div>
                        <div className={'GridBottomSection'}>
                            <div className={'GridSection'}>
                                <Typography className={'BottomSectionContent'}>Date Graded: </Typography>
                                <Typography className={'BottomSectionText'}>
                                    {new Date(hit.graded_at).getDate() +
                                        '/' +
                                        (new Date(hit.graded_at).getMonth() + 1) +
                                        '/' +
                                        new Date(hit.graded_at).getFullYear() +
                                        ' '}
                                    at{' '}
                                    {(new Date(hit.graded_at).getHours() % 12) +
                                        ':' +
                                        new Date(hit.graded_at).getMinutes()}
                                    {new Date(hit.graded_at).getHours() >= 12 ? 'pm' : 'am'}
                                </Typography>
                            </div>
                            <div className={'GridSection'}>
                                <Typography className={'BottomSectionContent'}>Certificate #:</Typography>
                                <Typography className={'BottomSectionText'}>{hit.certificate_number}</Typography>
                            </div>
                            <div className={'GridSection'}>
                                <Typography className={'BottomSectionContent'}>Owner: </Typography>
                                <Typography className={'BottomSectionText'}>{hit.owner_name}</Typography>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </GridDiv>
    );
});

export function FeedGridView() {
    return (
        <BrowserRouter>
            <BoxDiv>
                <CustomHits />
            </BoxDiv>
        </BrowserRouter>
    );
}

export default FeedGridView;
