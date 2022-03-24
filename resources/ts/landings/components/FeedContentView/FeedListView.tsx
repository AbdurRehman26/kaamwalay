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
import { BrowserRouter, Link } from 'react-router-dom';
import theme from '@shared/styles/theme';

const TableDiv = styled(TableContainer)({
    '.TableRow': {
        borderBottom: '1px solid #e0e0e0',
    },
    '.TableCard': {
        padding: '10px',
        textAlign: 'left',
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
    },
    '.Grade': {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        backgroundColor: '#42f9ff',
        borderRadius: '4px',
        color: 'transparentize(#000, 0.13)',
    },
    '.GradeLabel': {
        marginBottom: '6px',
        fontSize: '12px',
        lineHeight: '12px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.GradeValue': {
        fontWeight: '700',
        fontSize: '24px',
        lineHeight: '24px',
        color: 'rgba(0, 0, 0, 0.87)',
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
        padding: '20px 0',
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
const Hits = ({ hits }: { hits: any }) => (
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
                            <Link to={`feed/${hit.certificate_number}/view`} key={hit.objectID} className={'TableInfo'}>
                                <img className={'TableInfoImage'} src={hit.card_image} alt={hit.card_name} />
                                <div className={'TableInfoText'}>
                                    <Typography className={'TableInfoHeading'}>{hit.card_name}</Typography>
                                    <Typography className={'TableInfoSubHeading'}>{hit.searchable_name}</Typography>
                                    <div className={'MobileSection'}>
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
                            </Link>
                        </TableCell>
                        <TableCell className={'DateCell'}>
                            <Link to={`feed/${hit.certificate_number}/view`}>
                                <Typography>
                                    {new Date(hit.graded_at).getDate() +
                                        '/' +
                                        (new Date(hit.graded_at).getMonth() + 1) +
                                        '/' +
                                        new Date(hit.graded_at).getFullYear()}
                                </Typography>
                                <Typography>
                                    {(new Date(hit.graded_at).getHours() % 12) +
                                        ':' +
                                        new Date(hit.graded_at).getMinutes()}
                                    {new Date(hit.graded_at).getHours() >= 12 ? 'pm' : 'am'}
                                </Typography>
                            </Link>
                        </TableCell>
                        <TableCell className={'CertificateNoCell'}>
                            <Link to={`feed/${hit.certificate_number}/view`}>
                                <Typography>{hit.certificate_number}</Typography>
                            </Link>
                        </TableCell>
                        <TableCell className={'OwnerNameCell'}>
                            <Link to={`feed/${hit.certificate_number}/view`}>
                                <Typography>{hit.owner_name}</Typography>
                            </Link>
                        </TableCell>
                        <TableCell className={'TableGrade'}>
                            <Link to={`feed/${hit.certificate_number}/view`} className={'Grade'}>
                                <Typography className={'GradeLabel'}>{hit.grade_nickname}</Typography>
                                <Typography className={'GradeValue'}>{hit.overall_grade}</Typography>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableDiv>
);

const CustomHits = connectHits(Hits);

export function FeedListView() {
    return (
        <BrowserRouter>
            <BoxDiv>
                <Grid className={'FeedList'}>
                    <div className={'FeedContainer'}>
                        <div className={'FeedTableHolder'}>
                            <CustomHits />
                        </div>
                    </div>
                </Grid>
            </BoxDiv>
        </BrowserRouter>
    );
}

export default FeedListView;
