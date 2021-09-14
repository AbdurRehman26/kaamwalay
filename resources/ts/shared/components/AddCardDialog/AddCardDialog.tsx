import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import { AddCardDialogViewEnum } from '@shared/constants/AddCardDialogViewEnum';
import { useAddCardDialogState } from '@shared/redux/hooks/useAddCardDialogState';
import CardView, { CardViewProps } from './CardView';
import ListCardsView from './ListCardsView';

export interface AddCardDialogProps extends Omit<DialogProps, 'open'> {
    onAdd: CardViewProps['onAdd'];
}

const useStyles = makeStyles(
    (theme) => ({
        root: {},
        paper: {
            width: '100%',
            overflow: 'hidden',
        },
    }),
    { name: 'AddCardDialog' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: AddCardDialog
 * @date: 13.09.2021
 * @time: 19:24
 */
export function AddCardDialog({ onAdd, ...rest }: AddCardDialogProps) {
    const classes = useStyles();
    const dialogState = useAddCardDialogState();

    return (
        <Dialog open={dialogState.open} classes={{ paper: classes.paper }} maxWidth={'sm'} {...rest}>
            <Slide in={dialogState.view === AddCardDialogViewEnum.List} direction={'left'} unmountOnExit exit={false}>
                <ListCardsView />
            </Slide>
            <Slide in={dialogState.view === AddCardDialogViewEnum.Card} direction={'right'} unmountOnExit exit={false}>
                <CardView onAdd={onAdd} />
            </Slide>
        </Dialog>
    );
}

export default AddCardDialog;
