import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LabelLogo from '@shared/assets/label.png';
import {
    removeCardLabels,
    setEditLabelDialog,
    updateCardLabel,
    updateCardLabelPayloadData,
    updateMultipleCardsLabel,
    updateMultipleLabels,
} from '@shared/redux/slices/adminOrderLabelsSlice';
import { RootState } from '../../redux/store';
import { LabelsContent } from './LabelsContent';

const CardDiv = styled(Grid)({
    display: 'flex',
    justifyContent: 'space-between',

    '.CardInfo': {
        display: 'flex',
        alignItems: 'center',
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
    },
    '.RightSideDiv': {
        width: '337px',
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
        width: '337px',
        padding: '15px',
    },
    '.LableImage': {
        width: '297px',
        margin: '15px',
        height: '178px',
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
    '.Imagecontent': {
        display: 'flex',
        position: 'relative',
        justifyContent: 'space-around',
        bottom: '95px',
        alignItems: 'center',
    },
    '.LabelImageLeftText': {
        marginLeft: '5px',
    },
    '.LabelImageRightText': {
        marginRight: '10px',
    },
    '.LabelText': {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '14px',
    },
    '.GradeText': {
        fontSize: '28px',
        lineHeight: '28px',
        fontWeight: 400,
    },
});

const LabelDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        maxWidth: '675px',
    },
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
        padding: '10px 30px',
        '&:hover': {
            background: '#20BFB8',
        },
    },
});

interface props {
    orderNumber?: string;
}

export function EditLabelDialog({ orderNumber }: props) {
    const dispatch = useDispatch();
    const { id } = useParams<'id'>();
    const [isLoading, setIsLoading] = useState(false);
    const labelDialog = useSelector((state: RootState) => state.adminOrderLabels.openLabelDialog.labelDialog);
    const orderLabels = useSelector((state: RootState) => state.adminOrderLabels.orderLabels.labels);
    const cardLabel = useSelector((state: RootState) => state.adminOrderLabels.cardsLabel.labels);
    const multipleLabelData = useSelector((state: RootState) => state.adminOrderLabels.multipleLabelData.labelData);
    const [lineOne, setLineOne] = useState(cardLabel?.lineOne);
    const [lineTwo, setLineTwo] = useState(cardLabel?.lineTwo);
    const [lineThree, setLineThree] = useState(cardLabel?.lineThree);
    const [lineFour, setLineFour] = useState(cardLabel?.lineFour);
    const [cardLabelId, setCardLabelId] = useState(cardLabel?.cardLabelId);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    useEffect(() => {
        if (labelDialog) {
            setCardLabelId(cardLabel?.cardLabelId);
            setLineOne(cardLabel?.lineOne);
            setLineTwo(cardLabel?.lineTwo);
            setLineThree(cardLabel?.lineThree);
            setLineFour(cardLabel?.lineFour);
            orderLabels.map((orderLabel) => {
                dispatch(
                    updateMultipleCardsLabel({
                        cardLabelId: orderLabel.cardLabelId,
                        certificateNumber: orderLabel.certificateNumber,
                        lineOne: orderLabel.lineOne,
                        lineTwo: orderLabel.lineTwo,
                        lineThree: orderLabel.lineThree,
                        lineFour: orderLabel.lineFour,
                        persistChanges: orderLabel.persistChanges,
                    }),
                );
            });
        }

        if (multipleLabelData.length > 0 && !labelDialog) {
            multipleLabelData.map((labelData) => {
                if (labelData.cardLabelId) {
                    dispatch(removeCardLabels(labelData.cardLabelId));
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [labelDialog, dispatch]);

    useEffect(() => {
        orderLabels.map((orderLabel) => {
            dispatch(
                updateCardLabelPayloadData({
                    cardLabelId: orderLabel.cardLabelId,
                    certificateNumber: orderLabel.certificateNumber,
                    lineOne: orderLabel.lineOne,
                    lineTwo: orderLabel.lineTwo,
                    lineThree: orderLabel.lineThree,
                    lineFour: orderLabel.lineFour,
                    persistChanges: orderLabel.persistChanges,
                }),
            );
        });
    }, [orderLabels, dispatch]);

    async function updateLabels() {
        if (multipleLabelData.length > 0) {
            console.log(multipleLabelData);
            setIsLoading(true);
            await dispatch(
                updateMultipleLabels({
                    data: multipleLabelData,
                    id: id,
                }),
            );
            multipleLabelData.map((labelData) => {
                if (labelData.cardLabelId) {
                    dispatch(removeCardLabels(labelData.cardLabelId));
                }
            });
            setIsLoading(false);
            dispatch(setEditLabelDialog(false));
        } else if (JSON.stringify(cardLabel) !== '{}') {
            setIsLoading(true);
            await dispatch(updateCardLabel({ cardLabelId, lineOne, lineTwo, lineThree, lineFour }));
            setIsLoading(false);
            dispatch(setEditLabelDialog(false));
        }
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleModal = useCallback(() => {
        dispatch(setEditLabelDialog(false));
    }, [dispatch]);

    return (
        <LabelDialog onClose={handleModal} open={labelDialog} fullWidth>
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
                {orderLabels.length !== 0 ? (
                    orderLabels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((orderLabel) => (
                        <>
                            <LabelsContent labels={orderLabel} />
                            <Divider />
                        </>
                    ))
                ) : (
                    <CardDiv>
                        <div className={'LeftSideDiv'}>
                            <div className={'CardInfo'}>
                                <div className={'CardImageDiv'}>
                                    <img
                                        src={cardLabel?.cardProduct?.imagePath}
                                        alt={cardLabel?.cardProduct?.name}
                                        className={'CardImage'}
                                    />
                                </div>
                                <div className={'CardTextDiv'}>
                                    <Typography className={'CardName'}>{cardLabel?.cardProduct?.name}</Typography>
                                    <Typography className={'CardLongName'}>
                                        {cardLabel?.cardProduct?.longName}
                                    </Typography>
                                </div>
                            </div>
                            <div>
                                <Typography className={'LinesText'}>Lines 1 - 4</Typography>
                            </div>
                            <div className={'InputTextDiv'}>
                                <Typography className={'TextBoxNumber'}>1:</Typography>
                                <TextField
                                    sx={{
                                        borderRadius: '4px',
                                        padding: '5px',
                                        width: '100%',
                                    }}
                                    name={'lineOne'}
                                    value={lineOne}
                                    fullWidth
                                    size={'small'}
                                    variant={'outlined'}
                                    onChange={(e) => {
                                        setLineOne(e.target.value);
                                        setCardLabelId(cardLabelId);
                                    }}
                                />
                            </div>
                            <div className={'InputTextDiv'}>
                                <Typography className={'TextBoxNumber'}>2:</Typography>
                                <TextField
                                    sx={{
                                        borderRadius: '4px',
                                        padding: '5px',
                                        width: '100%',
                                    }}
                                    name={'lineTwo'}
                                    value={lineTwo}
                                    fullWidth
                                    size={'small'}
                                    variant={'outlined'}
                                    onChange={(e) => {
                                        setLineTwo(e.target.value);
                                    }}
                                />
                            </div>
                            <div className={'InputTextDiv'}>
                                <Typography className={'TextBoxNumber'}>3:</Typography>
                                <TextField
                                    sx={{
                                        borderRadius: '4px',
                                        padding: '5px',
                                        width: '100%',
                                    }}
                                    name={'lineThree'}
                                    value={lineThree}
                                    fullWidth
                                    size={'small'}
                                    variant={'outlined'}
                                    onChange={(e) => {
                                        setLineThree(e.target.value);
                                    }}
                                />
                            </div>
                            <div className={'InputTextDiv'}>
                                <Typography className={'TextBoxNumber'}>4:</Typography>
                                <TextField
                                    sx={{
                                        borderRadius: '4px',
                                        padding: '5px',
                                        width: '100%',
                                    }}
                                    name={'lineFour'}
                                    value={lineFour}
                                    fullWidth
                                    size={'small'}
                                    variant={'outlined'}
                                    onChange={(e) => {
                                        setLineFour(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={'RightSideDiv'}>
                            <Typography className={'LabelPreviewText'}>Label Preview</Typography>
                            <div>
                                <img src={LabelLogo} alt={'Label'} className={'LableImage'} />
                            </div>
                            <div className={'Imagecontent'}>
                                <div className={'LabelImageLeftText'}>
                                    <Typography className={'LabelText'}>{lineOne}</Typography>
                                    <Typography className={'LabelText'}>{lineTwo}</Typography>
                                    <Typography className={'LabelText'}>{lineThree}</Typography>
                                    <Typography className={'LabelText'}>{lineFour}</Typography>
                                </div>
                                <div className={'LabelImageRightText'}>
                                    <Typography className={'LabelText'} sx={{ textAlign: 'end' }}>
                                        {'XX-XX'}
                                    </Typography>
                                    <Typography className={'GradeText'} sx={{ textAlign: 'end' }}>
                                        {'X.X'}
                                    </Typography>
                                    <Typography className={'LabelText'} sx={{ textAlign: 'end' }}>
                                        {'XXXXXXX'}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </CardDiv>
                )}
                {orderLabels.length !== 0 ? (
                    <TablePagination
                        rowsPerPageOptions={[]}
                        component="div"
                        count={orderLabels.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button className={'CancelButton'} onClick={handleModal}>
                    Cancel
                </Button>
                <Button className={'ExportButton'} onClick={updateLabels}>
                    {isLoading ? (
                        <CircularProgress sx={{ color: '#fff' }} />
                    ) : JSON.stringify(cardLabel) !== '{}' ? (
                        'Save'
                    ) : (
                        'Export'
                    )}
                </Button>
            </DialogActions>
        </LabelDialog>
    );
}
