import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { connectHits } from 'react-instantsearch-dom';
import { formatDate } from '@shared/lib/datetime/formatDate';
import theme from '@shared/styles/theme';

const GridDiv = styled(Grid)({
    '.GridView': {
        width: '288px',
        height: '411px',
        background: '#ffffff',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        flex: '1 1 auto',
        display: 'inline-flex',
        flexDirection: 'column',
        margin: '10px 10px',
        alignItems: 'center',
    },
    '.GridTopSection': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        borderBottom: '1px solid #E0E0E0',
        overflow: 'hidden',
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
        maxWidth: '190px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    '.CardLongName': {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
        position: 'relative',
        display: 'inline-block',
        maxWidth: '600px',
        maxHeight: '48px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordWrap: 'break-word',
        '&:before': {
            position: 'absolute',
            content: '"..."',
            insetBlockEnd: '0',
            insetInlineEnd: '0',
        },
        '&:after': {
            content: '""',
            position: 'absolute',
            insetInlineEnd: '0',
            width: '1rem',
            height: '1rem',
            background: 'white',
        },
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
                <a href={`feed/${hit.certificate_number}/view`} key={hit.objectID}>
                    <div className={'GridView'}>
                        <div className={'GridTopSection'}>
                            <div className={'GridTextSection'}>
                                <Typography className={'CardName'}>{hit.card_name}</Typography>
                                <Typography className={'CardLongName'}>{hit.searchable_name}</Typography>
                            </div>
                            <div className={'GridGradeSection'}>
                                <Typography className={'GradeNickName'}>{hit.grade_nickname}</Typography>
                                <Typography className={'OverallGrade'}>{hit.grade_overall}</Typography>
                            </div>
                        </div>
                        <div className={'GridImageSection'}>
                            <img className={'CardImage'} src={hit.card_image} alt={hit.card_name} />
                        </div>
                        <div className={'GridBottomSection'}>
                            <div className={'GridSection'}>
                                <Typography className={'BottomSectionContent'}>Date Graded: </Typography>
                                <Typography className={'BottomSectionText'}>
                                    {formatDate(hit.graded_at, 'MM/DD/YYYY')} at {formatDate(hit.graded_at, 'h:mm a')}
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
                </a>
            ))}
        </GridDiv>
    );
});

export function FeedGridView() {
    return (
        <BoxDiv>
            <CustomHits />
        </BoxDiv>
    );
}

export default FeedGridView;
