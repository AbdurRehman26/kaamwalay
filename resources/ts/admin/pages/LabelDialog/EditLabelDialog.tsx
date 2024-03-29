import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
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
    addOrderNumber,
    removeCardLabels,
    setEditLabelDialog,
    updateCardLabel,
    updateCardLabelPayloadData,
    updateMultipleCardsLabel,
    updateMultipleLabels,
} from '@shared/redux/slices/adminOrderLabelsSlice';
import CardDiv from '@admin/pages/LabelDialog/CardDiv';
import { RootState } from '../../redux/store';
import { LabelsContent } from './LabelsContent';

const LabelDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        maxWidth: '686px',
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
            dispatch(addOrderNumber(orderNumber));
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
        <LabelDialog open={labelDialog} fullWidth>
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
                            <div className={'InputTextDiv'}>
                                <Typography className={'TextBoxNumber'}>1:</Typography>
                                <TextField
                                    className={'TextField'}
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
                                    className={'TextField'}
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
                                    className={'TextField'}
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
                                    className={'TextField'}
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
                                    <Typography className={'LabelText'}>{lineOne?.substring(0, 26)}</Typography>
                                    <Typography className={'LabelText'}>{lineTwo?.substring(0, 26)}</Typography>
                                    <Typography className={'LabelText'}>{lineThree?.substring(0, 26)}</Typography>
                                    <Typography className={'LabelText'}>{lineFour?.substring(0, 26)}</Typography>
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
                        <CircularProgress size={24} sx={{ color: '#fff' }} />
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
