import { connectHits } from 'react-instantsearch-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import theme from '@shared/styles/theme';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const TableDiv = styled(TableContainer)({
    '.TableRow': {
        borderBottom: '1px solid #e0e0e0',
    },
    '.TableCard': {
        padding: '16px',
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
    '.TableGradeMobile': {
        width: '96px',
        textAlign: 'right',
        [theme.breakpoints.down('lg')]: {
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
const Hits = ({ hits }) => (
    <TableDiv>
        <Table sx={{ minWidth: 650 }} size="small">
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
                {hits.map((hit) => (
                    <TableRow key={hit.objectID} className={'TableRow'}>
                        <TableCell className={'TableCard'}>
                            <p className={'TableInfo'}>
                                <img className={'TableInfoImage'} src={hit.card_image} alt={hit.card_name} />
                                <div className={'TableInfoText'}>
                                    <Typography className={'TableInfoHeading'}>{hit.card_name}</Typography>
                                    <Typography className={'TableInfoSubHeading'}>{hit.searchable_name}</Typography>
                                    <Typography></Typography>
                                </div>
                                <div className={'TableGradeMobile'}>
                                    <div className={'Grade'}>
                                        <Typography className={'GradeLabel'}>{hit.grade_nickname}</Typography>
                                        <Typography className={'GradeValue'}>{hit.overall_grade}</Typography>
                                    </div>
                                </div>
                            </p>
                        </TableCell>
                        <TableCell className={'DateCell'}>
                            <p>
                                <Typography>08/24/2021</Typography>
                                <Typography>11:24 AM</Typography>
                            </p>
                        </TableCell>
                        <TableCell className={'CertificateNoCell'}>
                            <p>
                                <Typography>{hit.certificate_number}</Typography>
                            </p>
                        </TableCell>
                        <TableCell className={'OwnerNameCell'}>
                            <p>
                                <Typography>{hit.owner_name}</Typography>
                            </p>
                        </TableCell>
                        <TableCell className={'TableGrade'}>
                            <p className={'Grade'}>
                                <Typography className={'GradeLabel'}>{hit.grade_nickname}</Typography>
                                <Typography className={'GradeValue'}>{hit.overall_grade}</Typography>
                            </p>
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
