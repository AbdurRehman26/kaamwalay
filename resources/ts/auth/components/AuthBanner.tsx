import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { PropsWithChildren } from 'react';
import LogoPoweredByAgs from '@shared/assets/logoPoweredByAgs.svg';
import robogradingBanner from '@shared/assets/robogradingBanner.png';
import { cx } from '@shared/lib/utils/cx';

interface AuthBannerProps {
    headline: string;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 520,
            padding: '64px 24px',
            [theme.breakpoints.down('sm')]: {
                padding: 0,
            },
        },
        content: {
            paddingBottom: 32,
            [theme.breakpoints.down('sm')]: {
                padding: 0,
            },
        },
        bannerHolder: {
            flex: '1 1 auto',
            position: 'relative',
            minHeight: 260,
            '& img': {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                objectPosition: 'center top',
                objectFit: 'contain',
            },
        },
        text: {
            color: '#fff',
        },
        divider: {
            margin: '32px 0',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        hideOnMobile: {
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        brandContainer: {
            [theme.breakpoints.down('sm')]: {
                padding: '12px 12px',
            },
        },
        brand: {
            [theme.breakpoints.down('sm')]: {
                width: '249px',
                height: '59px',
                marginLeft: '12px',
                display: 'block',
            },
        },
    }),
    { name: 'AuthBanner' },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: AuthBanner
 * @date: 09.08.2021
 * @time: 22:00
 */
export function AuthBanner({ headline, children }: PropsWithChildren<AuthBannerProps>) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <Link className={classes.brandContainer}>
                    <img src={LogoPoweredByAgs} alt={'Robograding Logo'} className={classes.brand} />
                </Link>
                <div className={classes.hideOnMobile}>
                    <Divider className={classes.divider} />
                    <Typography className={classes.text} variant={'h3'} component={'h1'} paragraph>
                        {headline}
                    </Typography>
                    <Typography className={classes.text} variant={'body1'}>
                        {children}
                    </Typography>
                </div>
            </div>
            <div className={cx(classes.bannerHolder, classes.hideOnMobile)}>
                <img src={robogradingBanner} alt="Robograding" />
            </div>
        </div>
    );
}

export default AuthBanner;
