import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
// import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export interface AddRaritiesDialogProps extends Omit<DialogProps, 'onSubmit'> {
    onSubmit(): Promise<void> | void;
}

export function AddRaritiesDialog(props: AddRaritiesDialogProps) {
    const { onClose, onSubmit, ...rest } = props;
    return (
        <Dialog {...rest}>
            <DialogTitle>Add Card</DialogTitle>
            <DialogContent>
                <FormControl sx={{ m: 1, minWidth: '97%' }}>
                    <FormHelperText sx={{ fontWeight: 'bold', color: '#000', marginLeft: 0 }}>Category</FormHelperText>
                    <Select
                    // value={cardCategory}
                    // onChange={handleCardCategoryChange}
                    // defaultValue={cardCategory}
                    >
                        {/* {availableCategories?.map((item) => {
                return (
                    <MenuItem key={item.id} value={item.id}>
                        {item.name}
                    </MenuItem>
                );
            })} */}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions></DialogActions>
        </Dialog>
    );
}
