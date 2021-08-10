import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React, { PropsWithChildren } from 'react';

import { ReactComponent as LogoPoweredByAgs } from '@shared/assets/logoPoweredByAgs.svg';
import robogradingBanner from '@shared/assets/robogradingBanner.png';

interface AuthBannerProps {
    headline: string;
}

const useStyles = makeStyles(
    {
        root: {
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 520,
            padding: '64px 24px',
        },
        content: {
            paddingBottom: 32,
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
    },
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
                <Link>
                    <LogoPoweredByAgs />
                </Link>
                <Divider className={classes.divider} />
                <Typography className={classes.text} variant={'h3'} component={'h1'} paragraph>
                    {headline}
                </Typography>
                <Typography className={classes.text} variant={'body1'}>
                    {children}
                </Typography>
            </div>
            <div className={classes.bannerHolder}>
                <img src={robogradingBanner} alt="Robograding" />
            </div>
        </div>
    );
}

export default AuthBanner;
