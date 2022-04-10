import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { connectHits } from 'react-instantsearch-dom';
import { formatDate } from '@shared/lib/datetime/formatDate';
import theme from '@shared/styles/theme';

const TableDiv = styled(TableContainer)({
    '.TableRow': {
        borderBottom: '1px solid #e0e0e0',
    },
    '.TableCard': {
        padding: '10px',
        textAlign: 'left',
        [theme.breakpoints.down('sm')]: {
            padding: '15px 5px',
        },
    },
    '.TableInfo': {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'stretch',
    },
    '.TableInfoImage': {
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 2px 1px 0 rgba(0, 0, 0, 0.12),0 1px 1px 0 rgba(0, 0, 0, 0.14)',
        width: '52px',
        [theme.breakpoints.down('sm')]: {
            width: '52px',
            height: '82px',
        },
    },
    '.TableInfoText': {
        paddingLeft: '14px',
        maxWidth: '240px',
        [theme.breakpoints.down('sm')]: {
            padding: '0px 10px',
        },
    },
    '.TableInfoHeading': {
        fontWeight: '500',
        fontSize: '16px',
        lineHeight: '24px',
    },
    '.TableInfoSubHeading': {
        fontSize: '12px',
        marginBottom: '10px',
    },
    '.TableHead': {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    '.TableGrade': {
        width: '96px',
        textAlign: 'right',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    '.Grade': {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        backgroundColor: '#20BFB8',
        borderRadius: '4px',
        color: '#FFFFFF',
        [theme.breakpoints.down('sm')]: {
            minWidth: '16%',
        },
    },

    '.GradeMobile': {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '16%',
        height: '64px',
        backgroundColor: '#20bfb8',
        borderRadius: '4px',
        color: 'transparentize(#000, 0.13)',
        [theme.breakpoints.up('lg')]: {
            display: 'none',
        },
    },

    '.GradeLabel': {
        marginBottom: '6px',
        fontSize: '12px',
        lineHeight: '12px',
        color: '#FFFFFF',
    },
    '.GradeValue': {
        fontWeight: '700',
        fontSize: '24px',
        lineHeight: '24px',
        color: '#FFFFFF',
    },
    '.DateCell': {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    '.CertificateNoCell': {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    '.OwnerNameCell': {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
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
    '.MobileSection': {
        display: 'flex',
        alignItems: 'stretch',
        [theme.breakpoints.up('lg')]: {
            display: 'none',
        },
    },
});
const BoxDiv = styled(Box)({
    '.FeedList': {
        flex: '1 1 auto',
        color: '#000000de',
        backgroundColor: '#ffffff',
    },
    '.FeedContainer': {},
    '.FeedTableHolder': {
        maxWidth: '100%',
        overflowX: 'auto',
    },
});
const CustomHits = connectHits(({ hits }) => {
    return (
        <TableDiv>
            <Table>
                <TableHead className={'TableHead'}>
                    <TableRow>
                        <TableCell>Card</TableCell>
                        <TableCell>Date Graded</TableCell>
                        <TableCell>Certificate #</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Grade</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {hits.map((hit: any) => (
                        <TableRow key={hit.objectID} className={'TableRow'}>
                            <TableCell className={'TableCard'}>
                                <a
                                    href={`feed/${hit.certificate_number}/view`}
                                    key={hit.objectID}
                                    className={'TableInfo'}
                                >
                                    <img className={'TableInfoImage'} src={hit.card_image} alt={hit.card_name} />
                                    <div className={'TableInfoText'}>
                                        <Typography className={'TableInfoHeading'}>{hit.card_name}</Typography>
                                        <Typography className={'TableInfoSubHeading'}>{hit.searchable_name}</Typography>
                                        <div className={'MobileSection'}>
                                            <Typography className={'BottomSectionContent'}>Date Graded: </Typography>
                                            <Typography className={'BottomSectionText'}>
                                                {formatDate(hit.graded_at, 'MM/DD/YYYY')} at{' '}
                                                {formatDate(hit.graded_at, 'h:mm a')}
                                            </Typography>
                                        </div>
                                        <div className={'MobileSection'}>
                                            <Typography className={'BottomSectionContent'}>Certificate #:</Typography>
                                            <Typography className={'BottomSectionText'}>
                                                {hit.certificate_number}
                                            </Typography>
                                        </div>
                                        <div className={'MobileSection'}>
                                            <Typography className={'BottomSectionContent'}>Owner: </Typography>
                                            <Typography className={'BottomSectionText'}>{hit.owner_name}</Typography>
                                        </div>
                                    </div>
                                    <div className={'GradeMobile'}>
                                        <Typography className={'GradeLabel'}>{hit.grade_nickname}</Typography>
                                        <Typography className={'GradeValue'}>{hit.grade_overall}</Typography>
                                    </div>
                                </a>
                            </TableCell>
                            <TableCell className={'DateCell'}>
                                <a href={`feed/${hit.certificate_number}/view`}>
                                    <Typography>{formatDate(hit.graded_at, 'MM/DD/YYYY')}</Typography>
                                    <Typography>{formatDate(hit.graded_at, 'h:mm a')}</Typography>
                                </a>
                            </TableCell>
                            <TableCell className={'CertificateNoCell'}>
                                <a href={`feed/${hit.certificate_number}/view`}>
                                    <Typography>{hit.certificate_number}</Typography>
                                </a>
                            </TableCell>
                            <TableCell className={'OwnerNameCell'}>
                                <a href={`feed/${hit.certificate_number}/view`}>
                                    <Typography>{hit.owner_name}</Typography>
                                </a>
                            </TableCell>
                            <TableCell className={'TableGrade'}>
                                <a href={`feed/${hit.certificate_number}/view`} className={'Grade'}>
                                    <Typography className={'GradeLabel'}>{hit.grade_nickname}</Typography>
                                    <Typography className={'GradeValue'}>{hit.grade_overall}</Typography>
                                </a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableDiv>
    );
});

export function FeedListView() {
    return (
        <BoxDiv>
            <Grid className={'FeedList'}>
                <div className={'FeedContainer'}>
                    <div className={'FeedTableHolder'}>
                        <CustomHits />
                    </div>
                </div>
            </Grid>
        </BoxDiv>
    );
}

export default FeedListView;
