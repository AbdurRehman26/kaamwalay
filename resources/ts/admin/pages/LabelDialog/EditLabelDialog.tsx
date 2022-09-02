import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LabelLogo from '@shared/assets/label.png';
import { setEditLabelDialog } from '@shared/redux/slices/adminEditLabelDialogSlice';
import { RootState } from '../../redux/store';

const CardDiv = styled(Grid)({
    display: 'flex',
    justifyContent: 'space-between',

    '.CardInfo': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    '.CardName': {
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CardImage': {
        width: '35px',
        height: '48px',
    },

    '.CardLongName': {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CardImageDiv': {},
    '.CardTextDiv': {
        paddingLeft: '7px',
    },
    '.LinesText': {
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '.InputTextDiv': {
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0px',
    },
    '.RightSideDiv': {
        background: '#5F5F5F',
    },
    '.LabelPreviewText': {
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: '#FFFFFF',
        padding: '20px',
    },
    '.LeftSideDiv': {
        padding: '20px',
    },
    '.LableImage': {
        padding: '20px',
        width: '290px',
    },
    '.TextBoxNumber': {
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
        marginRight: '10px',
    },
    '.CheckBoxLabel': {
        '& .MuiFormControlLabel-label': {
            fontSize: '14px!important',
            lineHeight: '20px',
            letterSpacing: '0.1px',
            color: '#20BFB8',
        },
    },
    '.LabelImageLeftText': {
        position: 'absolute',
        top: '223px',
        right: '127px',
    },
    '.LabelImageRightText': {
        position: 'absolute',
        right: '33px',
        top: '224px',
        textAlign: 'end',
    },
    '.LabelText': {
        fontSize: '10px',
        fontWeight: 'bold',
    },
    '.GradeText': {
        fontSize: '20px',
        fontWeight: 'bold',
    },
});

const LabelDialog = styled(Dialog)({
    '& .MuiDialogContent-root': {
        padding: '0px 0px',
    },
    '.CancelButton': {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.ExportButton': {
        background: '#20BFB8',
        borderRadius: '4px',
        color: '#fff',
        padding: '10px 20px',
        '&:hover': {
            background: '#20BFB8',
        },
    },
});

export function EditLabelDialog() {
    const dispatch = useDispatch();
    const labelDialog = useSelector((state: RootState) => state.adminEditLabelDialog.openLabelDialog.labelDialog);

    const handleModal = useCallback(() => {
        dispatch(setEditLabelDialog(false));
    }, [dispatch]);

    return (
        <LabelDialog onClose={handleModal} open={labelDialog} maxWidth={'sm'} fullWidth>
            <DialogTitle>
                Edit Label Text
                <IconButton
                    onClick={handleModal}
                    aria-label="close"
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <CardDiv>
                    <div className={'LeftSideDiv'}>
                        <div className={'CardInfo'}>
                            <div className={'CardImageDiv'}>
                                <img
                                    src="https://den-cards.pokellector.com/197/Charizard.EVO.11.13280.png"
                                    alt="cardImage"
                                    className={'CardImage'}
                                />
                            </div>
                            <div className={'CardTextDiv'}>
                                <Typography className={'CardName'}>Charizard</Typography>
                                <Typography className={'CardLongName'}>
                                    2020 Pokemon Sword & Shield Vivid Voltag...
                                </Typography>
                            </div>
                        </div>
                        <div>
                            <Typography className={'LinesText'}>Lines 1 - 4</Typography>
                        </div>
                        <div className={'InputTextDiv'}>
                            <Typography className={'TextBoxNumber'}>1:</Typography>
                            <Input
                                type="text"
                                value={'2021 P.M. JAPANESE SWSH'}
                                disableUnderline
                                sx={{
                                    border: '1px solid #DADADA',
                                    borderRadius: '4px',
                                    padding: '5px',
                                    width: '100%',
                                }}
                            />
                        </div>
                        <div className={'InputTextDiv'}>
                            <Typography className={'TextBoxNumber'}>2:</Typography>
                            <Input
                                type="text"
                                value={'FA/GENGAR VMAX'}
                                disableUnderline
                                sx={{
                                    border: '1px solid #DADADA',
                                    borderRadius: '4px',
                                    padding: '5px',
                                    width: '100%',
                                }}
                            />
                        </div>
                        <div className={'InputTextDiv'}>
                            <Typography className={'TextBoxNumber'}>3:</Typography>
                            <Input
                                type="text"
                                value={'2GENGAR VMAX HIGH-CLS. DK.'}
                                disableUnderline
                                sx={{
                                    border: '1px solid #DADADA',
                                    borderRadius: '4px',
                                    padding: '5px',
                                    width: '100%',
                                }}
                            />
                        </div>
                        <div className={'InputTextDiv'}>
                            <Typography className={'TextBoxNumber'}>4:</Typography>
                            <Input
                                type="text"
                                value={'#002'}
                                disableUnderline
                                sx={{
                                    border: '1px solid #DADADA',
                                    borderRadius: '4px',
                                    padding: '5px',
                                    width: '100%',
                                }}
                            />
                        </div>
                        <FormControlLabel
                            className={'CheckBoxLabel'}
                            control={<Checkbox defaultChecked />}
                            label="Save changes to this card’s label"
                        />
                    </div>
                    <div className={'RightSideDiv'}>
                        <Typography className={'LabelPreviewText'}>Label Preview</Typography>
                        <div className={'LabelImageLeftText'}>
                            <Typography className={'LabelText'}>2021 P.M. JAPANESE SWSH</Typography>
                            <Typography className={'LabelText'}>FA/GENGAR VMAX</Typography>
                            <Typography className={'LabelText'}>GENGAR VMAX HIGH-CLS.</Typography>
                            <Typography className={'LabelText'}>#003</Typography>
                        </div>
                        <div className={'LabelImageRightText'}>
                            <Typography className={'LabelText'}>MINT</Typography>
                            <Typography className={'GradeText'}>9</Typography>
                            <Typography className={'LabelText'}>0000001</Typography>
                        </div>
                        <img src={LabelLogo} alt={'Label'} className={'LableImage'} />
                    </div>
                </CardDiv>
            </DialogContent>
            <DialogActions>
                <Button className={'CancelButton'} onClick={handleModal}>
                    Cancel
                </Button>
                <Button className={'ExportButton'} onClick={handleModal}>
                    Export
                </Button>
            </DialogActions>
        </LabelDialog>
    );
}
