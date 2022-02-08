import Dialog, { DialogProps } from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import makeStyles from '@mui/styles/makeStyles';
import ManageCardDialogEdit from '@shared/components/ManageCardDialog/ManageCardDialogEdit';
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';
import { useManageCardDialogState } from '@shared/redux/hooks/useManageCardDialogState';
import ManageCardDialogList from './ManageCardDialogList';
import ManageCardDialogView, { ManageCardDialogViewProps } from './ManageCardDialogView';
import ManageCardDialogCreateCard from '@shared/components/ManageCardDialog/ManageCardDialogCreateCard';
import ManageCardDialogCreateSeries from '@shared/components/ManageCardDialog/ManageCardDialogCreateSeries';

export interface ManageCardDialogProps extends Omit<DialogProps, 'open'> {
    onAdd: ManageCardDialogViewProps['onAdd'];
}

const useStyles = makeStyles(
    () => ({
        root: {},
        paper: {
            width: '100%',
            overflow: 'hidden',
        },
    }),
    { name: 'ManageCardDialog' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ManageCardDialog
 * @date: 13.09.2021
 * @time: 19:24
 */
export function ManageCardDialog({ onAdd, ...rest }: ManageCardDialogProps) {
    const classes = useStyles();
    const dialogState = useManageCardDialogState();

    return (
        <Dialog open={dialogState.open} classes={{ paper: classes.paper }} scroll={'body'} maxWidth={'sm'} {...rest}>
            <Slide
                in={dialogState.view === ManageCardDialogViewEnum.List}
                direction={'left'}
                unmountOnExit
                exit={false}
            >
                <ManageCardDialogList />
            </Slide>
            <Slide
                in={dialogState.view === ManageCardDialogViewEnum.View}
                direction={'right'}
                unmountOnExit
                exit={false}
            >
                <ManageCardDialogView onAdd={onAdd} />
            </Slide>
            <Slide
                in={dialogState.view === ManageCardDialogViewEnum.Edit}
                direction={'left'}
                unmountOnExit
                exit={false}
            >
                <ManageCardDialogEdit onAdd={onAdd} declaredValue={dialogState.declaredValue} />
            </Slide>
            <Slide
                in={dialogState.view === ManageCardDialogViewEnum.Create}
                direction={'left'}
                unmountOnExit
                exit={false}
            >
                <ManageCardDialogCreateCard onAdd={onAdd} declaredValue={dialogState.declaredValue} />
            </Slide>
            <Slide
                in={dialogState.view === ManageCardDialogViewEnum.CreateSeries}
                direction={'left'}
                unmountOnExit
                exit={false}
            >
                <ManageCardDialogCreateSeries onAdd={onAdd} declaredValue={dialogState.declaredValue} />
            </Slide>
        </Dialog>
    );
}

export default ManageCardDialog;
