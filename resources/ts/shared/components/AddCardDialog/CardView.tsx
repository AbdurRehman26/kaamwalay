import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ForwardedRef, forwardRef, useCallback, useState } from 'react';
import { useAddCardDialogState } from '@shared/redux/hooks/useAddCardDialogState';
import AddCardDialogHeader from './AddCardDialogHeader';

interface CardViewProps {}

const useStyles = makeStyles(
    (theme) => ({
        root: {},
    }),
    { name: 'CardView' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: CardView
 * @date: 13.09.2021
 * @time: 22:11
 */
export const CardView = forwardRef((props: CardViewProps, ref: ForwardedRef<HTMLDivElement>) => {
    const classes = useStyles();
    const state = useAddCardDialogState();
    const card = state.selectedCard;
    const [declaredValue, setDeclaredValue] = useState(0);

    const handleChange = useCallback(
        (e) => {
            setDeclaredValue(e.target.value);
        },
        [setDeclaredValue],
    );

    console.log({ card });

    return (
        <div className={classes.root} ref={ref}>
            <AddCardDialogHeader back />
            <Divider />
            <DialogContent>
                {card ? (
                    <Box>
                        <img src={card?.imagePath} alt={card.getName()} />
                        <Box>
                            <Typography variant={'h6'}>{card.getName()}</Typography>
                            <Typography variant={'body1'}>{card.getDescription()}</Typography>

                            <Typography variant={'caption'} color={'textPrimary'}>
                                Value
                            </Typography>
                            <TextField fullWidth value={declaredValue} onChange={handleChange} />
                        </Box>
                    </Box>
                ) : null}
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button>Cancel</Button>
                <Button variant={'contained'} color={'primary'}>
                    Confirm
                </Button>
            </DialogActions>
        </div>
    );
});

export default CardView;
