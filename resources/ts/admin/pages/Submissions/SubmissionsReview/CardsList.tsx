import ClearAllIcon from '@mui/icons-material/ClearAll';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { PropsWithChildren, useCallback, useState } from 'react';
import { useNotifications } from '@shared/hooks/useNotifications';
import { font } from '@shared/styles/utils';

interface CardsListProps {
    heading: string;
    totals: number;
    extraAction?: any;
    onClear?: any;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginBottom: theme.spacing(3),
            border: '1px solid #e0e0e0',
        },
        header: {
            backgroundColor: '#f9f9f9',
            borderBottom: '1px solid #e0e0e0',
            padding: theme.spacing(1.5, 2),
        },
        headerContent: {
            display: 'flex',
            alignItems: 'center',
        },
        heading: {
            flexGrow: 1,
        },
        content: {
            padding: '0 !important',
        },
    }),
    { name: 'CardsList' },
);

export function CardsList({ children, heading, totals, extraAction, onClear }: PropsWithChildren<CardsListProps>) {
    const classes = useStyles();
    const notifications = useNotifications();
    const [loading, setLoading] = useState(false);

    const handleClear = useCallback(async () => {
        if (onClear) {
            setLoading(true);
            try {
                await onClear();
            } catch (e: any) {
                notifications.exception(e);
            }
            setLoading(false);
        }
    }, [notifications, onClear]);

    return (
        <Card variant={'outlined'} className={classes.root}>
            <CardHeader
                className={classes.header}
                classes={{ content: classes.headerContent }}
                title={
                    <Typography variant={'body1'} display={'inline'} className={classes.heading}>
                        <span className={font.fontWeightMedium}>{heading}</span> ({totals ?? 0})
                    </Typography>
                }
                subheader={
                    <>
                        {onClear ? (
                            <Button
                                onClick={handleClear}
                                startIcon={
                                    loading ? (
                                        <CircularProgress size={18} color={'inherit'} />
                                    ) : (
                                        <ClearAllIcon color={'inherit'} />
                                    )
                                }
                            >
                                Clear
                            </Button>
                        ) : null}
                        {extraAction}
                    </>
                }
                disableTypography
            />
            <CardContent className={classes.content}>{children}</CardContent>
        </Card>
    );
}

export default CardsList;
