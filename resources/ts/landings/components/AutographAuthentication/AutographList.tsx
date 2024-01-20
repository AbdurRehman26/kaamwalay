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
        alignItems: 'normal',
    },
    '.TableInfoImage': {
        maxWidth: '100%',
        maxHeight: '100%',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 2px 1px 0 rgba(0, 0, 0, 0.12),0 1px 1px 0 rgba(0, 0, 0, 0.14)',
    },
    '.TableInfoText': {
        paddingLeft: '14px',
        marginLeft: '15px',
        [theme.breakpoints.down('sm')]: {
            padding: '0px 10px',
        },
    },
    '.TableInfoHeading': {
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '24px',
    },
    '.TableHead': {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    '.BottomSectionText': {
        fontStyle: 'normal',
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
    '.GridImageSection': {
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
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center',
            padding: '10px',
            margin: '0px',
            maxWidth: '72px',
            maxHeight: '72px',
        },
    },
});
const BoxDiv = styled(Box)({
    [theme.breakpoints.up('sm')]: {
        display: 'none',
    },
    '.autographList': {
        flex: '1 1 auto',
        color: '#000000de',
        backgroundColor: '#ffffff',
    },
    '.autographTableHolder': {
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
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {hits.map((hit: any) => (
                        <TableRow key={hit.id} className={'TableRow'}>
                            <TableCell className={'TableCard'}>
                                <a
                                    href={`authentication/${hit.certificate_number}/view`}
                                    key={hit.id}
                                    className={'TableInfo'}
                                >
                                    <div className={'GridImageSection'}>
                                        <img className={'TableInfoImage'} src={hit.image_url} alt={hit.name} />
                                    </div>
                                    <div className={'TableInfoText'}>
                                        <Typography className={'TableInfoHeading'}>{hit.name}</Typography>
                                        <div className={'MobileSection'}>
                                            <Typography className={'BottomSectionText'}>
                                                {hit.certificate_number}
                                            </Typography>
                                        </div>
                                    </div>
                                </a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableDiv>
    );
});

export function AutographList() {
    return (
        <BoxDiv>
            <Grid className={'autographList'}>
                <div className={'autographContainer'}>
                    <div className={'autographTableHolder'}>
                        <CustomHits />
                    </div>
                </div>
            </Grid>
        </BoxDiv>
    );
}

export default AutographList;
