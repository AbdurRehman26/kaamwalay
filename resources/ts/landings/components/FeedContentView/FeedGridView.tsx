import { connectHits } from 'react-instantsearch-dom';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
        width: '25%',
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
    },
    '.OverallGrade': {
        fontStyle: 'normal',
        fontWeight: '900',
        fontSize: '24px',
        lineHeight: '24px',
        textAlign: 'center',
        color: '#ffffff',
    },
    '.GridImageSection': {
        padding: '10px 10px',
    },
    '.CardImage': {
        width: '170.66px',
        height: '237.78px',
    },
    '.GridBottomSection': {
        width: '100%',
        padding: '10px 10px',
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
const BoxDiv = styled(Box)({});
const Hits = ({ hits }) => (
    <GridDiv container>
        {hits.map((hit) => (
            <p key={hit.objectID}>
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
                        <Typography className={'BottomSectionContent'}>Date Graded: 08/24/2021 at 11:24 AM</Typography>
                        <Typography className={'BottomSectionContent'}>{hit.certificate_number}</Typography>
                        <Typography className={'BottomSectionContent'}>{hit.owner_name}</Typography>
                    </div>
                </div>
            </p>
        ))}
    </GridDiv>
);

const CustomHits = connectHits(Hits);

export function FeedGridView() {
    return (
        <BoxDiv>
            <CustomHits />
        </BoxDiv>
    );
}

export default FeedGridView;
