import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { useCallback } from 'react';
import cardPreview from '@shared/assets/cardPreview.png';
import { font } from '@shared/styles/utils';

interface CardItemProps {
    label: string;
    labelIcon?: any;
    onRemove(): void;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(1.5, 2),
            borderBottom: '1px solid #e0e0e0',
            '&:last-child': {
                borderBottom: 'none',
            },
        },
        image: {
            width: 28,
            marginRight: theme.spacing(1),
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.2)',
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            fontWeight: 500,
            padding: theme.spacing(0, 1),
        },
    }),
    { name: 'CardItem' },
);

export function CardItem({ label, labelIcon, onRemove }: CardItemProps) {
    const classes = useStyles();

    const handleRemove = useCallback(() => {
        onRemove();
    }, [onRemove]);

    return (
        <Grid container alignItems={'center'} className={classes.root}>
            <Box display={'flex'} flexGrow={1}>
                <img src={cardPreview} alt={'card'} className={classes.image} />
                <Box flexGrow={1}>
                    <Typography variant={'body2'} className={font.fontWeightMedium}>
                        Charizard
                    </Typography>
                    <Typography variant={'caption'}>2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard</Typography>
                </Box>
            </Box>

            <Typography variant={'body2'} color={'textSecondary'} className={classes.label}>
                {labelIcon ? (
                    <>
                        {labelIcon}
                        <Box component={'span'} pl={0.5}>
                            {label}
                        </Box>
                    </>
                ) : (
                    label
                )}
            </Typography>

            <IconButton size={'small'} onClick={handleRemove}>
                <CloseIcon />
            </IconButton>
        </Grid>
    );
}

export default CardItem;
