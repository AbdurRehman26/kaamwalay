import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { useCallback, useState } from 'react';
import { font } from '@shared/styles/utils';
import ReviewCardDialog from './ReviewCardDialog';
import UnconfirmedCard from './UnconfirmedCard';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(3),
            border: '1px solid #e0e0e0',
        },
        header: {
            backgroundColor: '#f9f9f9',
            borderBottom: '1px solid #e0e0e0',
            padding: theme.spacing(1.5, 2),
        },
        content: {
            padding: '0 !important',
        },
    }),
    { name: 'UnconfirmedCards' },
);

export function UnconfirmedCards() {
    const classes = useStyles();
    const [activePreview, setActivePreview] = useState<number | null>(null);

    const handlePreview = useCallback((value) => setActivePreview(value), [setActivePreview]);
    const handleNext = useCallback(() => setActivePreview((value) => (value ?? 0) + 1), [setActivePreview]);
    const handlePrevious = useCallback(
        () => setActivePreview((value) => Math.max((value ?? 0) - 1, 0)),
        [setActivePreview],
    );

    const handleClosePreview = useCallback(() => setActivePreview(null), [setActivePreview]);

    const handleConfirm = useCallback((value) => {
        console.log('handleConfirm', value);
    }, []);

    const handleMissing = useCallback((value) => {
        console.log('handleMissing', value);
    }, []);

    return (
        <>
            <TextField
                variant={'outlined'}
                placeholder={'Search cards...'}
                size={'small'}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position={'start'}>
                            <SearchIcon color={'disabled'} />
                        </InputAdornment>
                    ),
                }}
            />
            <Card variant={'outlined'} className={classes.root}>
                <CardHeader
                    className={classes.header}
                    title={
                        <Typography variant={'body1'}>
                            <span className={font.fontWeightMedium}>Unconfirmed Cards</span> (3)
                        </Typography>
                    }
                    disableTypography
                />
                <CardContent className={classes.content}>
                    <UnconfirmedCard
                        itemId={1}
                        onPreview={handlePreview}
                        onConfirm={handleConfirm}
                        onMissing={handleMissing}
                    />
                    <UnconfirmedCard
                        itemId={2}
                        onPreview={handlePreview}
                        onConfirm={handleConfirm}
                        onMissing={handleMissing}
                    />
                    <UnconfirmedCard
                        itemId={3}
                        onPreview={handlePreview}
                        onConfirm={handleConfirm}
                        onMissing={handleMissing}
                    />
                </CardContent>
            </Card>
            <ReviewCardDialog
                open={activePreview !== null}
                onClose={handleClosePreview}
                index={activePreview!}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onMissing={handleMissing}
                onConfirm={handleConfirm}
                disablePrevious={activePreview === 0}
            />
        </>
    );
}

export default UnconfirmedCards;
