import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { PropsWithChildren } from 'react';
import { font } from '@shared/styles/utils';

interface CardsListProps {
    heading: string;
    totals: number;
    onClear?: () => void;
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

export function CardsList({ children, heading, totals, onClear }: PropsWithChildren<CardsListProps>) {
    const classes = useStyles();

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
                    <Button onClick={onClear} startIcon={<ClearAllIcon color={'inherit'} />}>
                        Clear
                    </Button>
                }
                disableTypography
            />
            <CardContent className={classes.content}>{children}</CardContent>
        </Card>
    );
}

export default CardsList;
