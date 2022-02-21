import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { ReactComponent as RobogradingPoweredBy } from '@shared/assets/robogradingPoweredBy.svg';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CallIcon from '@mui/icons-material/CallOutlined';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import { useMemo } from 'react';

const Root = styled('footer')(({ theme }) => ({
    backgroundColor: '#f2f2f2',

    '.LayoutFooter-brand': {
        display: 'inline-flex',
        fontSize: 0,
        '& svg': {
            fill: '#5C5C5C',
        },
    },

    '.LayoutFooter-full': {
        [theme.breakpoints.down('md')]: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
        },
    },

    '.LayoutFooter-icon': {
        marginRight: 6,
        fontSize: 20,
    },

    '.LayoutFooter-link': {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            justifyContent: 'center',
            '&.LayoutFooter-linkPhone': {
                paddingBottom: theme.spacing(1),
            },
            '&.LayoutFooter-linkEmail': {
                paddingTop: theme.spacing(1),
            },
        },
    },
}));

export function LayoutFooter() {
    const year = useMemo(() => new Date().getFullYear(), []);

    return (
        <Root>
            <Container>
                <Grid container alignItems={'center'} justifyContent={{ xs: 'center', md: 'space-between' }} py={2}>
                    <Link to={'/'} className={'LayoutFooter-brand LayoutFooter-full'}>
                        <RobogradingPoweredBy />
                    </Link>

                    <MuiLink
                        href={'tel:+1 929-209-3925'}
                        variant={'body2'}
                        color={'textSecondary'}
                        className={'LayoutFooter-link LayoutFooter-linkPhone'}
                    >
                        <CallIcon color={'inherit'} className={'LayoutFooter-icon'} />
                        +1 929-209-3925
                    </MuiLink>

                    <MuiLink
                        href={'mailto:hey@ags.com'}
                        variant={'body2'}
                        color={'textSecondary'}
                        className={'LayoutFooter-link LayoutFooter-linkEmail'}
                    >
                        <EmailIcon color={'inherit'} className={'LayoutFooter-icon'} />
                        hey@ags.com
                    </MuiLink>

                    <Typography variant={'body2'} color={'textSecondary'}>
                        Copyright &copy; {year} by AGS Inc.
                    </Typography>
                </Grid>
            </Container>
        </Root>
    );
}
