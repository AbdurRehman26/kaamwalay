import Card, { CardProps } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { TypographyProps } from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { PropsWithChildren, useMemo } from 'react';
import { cx } from '@shared/lib/utils/cx';
import { font } from '../styles/utils';

interface OutlinedCardProps extends CardProps {
    heading: string;
    icon?: any;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            borderRadius: 4,
        },
        header: {
            padding: theme.spacing(1.5, 2),
            backgroundColor: '#f9f9f9',
            borderBottom: '1px solid #e0e0e0',
        },
        headerContainer: {
            display: 'flex',
            flexDirection: 'row',
        },
        content: {
            padding: theme.spacing(2, 2, 4, 2),
        },
    }),
    { name: 'OutlinedCard' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: OutlinedCard
 * @date: 28.08.2021
 * @time: 18:28
 */
export function OutlinedCard({ heading, children, icon, className, ...rest }: PropsWithChildren<OutlinedCardProps>) {
    const classes = useStyles();

    const titleProps = useMemo<TypographyProps>(() => ({ variant: 'body1', className: font.fontWeightMedium }), []);

    return (
        <Card className={cx(classes.root, className)} variant={'outlined'} {...rest}>
            <CardHeader avatar={icon} className={classes.header} title={heading} titleTypographyProps={titleProps} />
            <CardContent className={classes.content}>{children}</CardContent>
        </Card>
    );
}

export default OutlinedCard;
