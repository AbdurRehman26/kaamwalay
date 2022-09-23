import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { OrderLabelsDto } from '@shared/dto/OrderLabelsDto';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { setEditLabelDialog, updateCardLabel, updateMultipleLabels } from '@shared/redux/slices/adminOrderLabelsSlice';
import { RootState } from '../../redux/store';
import { LabelsContent } from './LabelsContent';

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
    const singleLabelData = useSelector((state: RootState) => state.adminOrderLabels.singleLabelData.labelData);
    const multipleLabelData = useSelector((state: RootState) => state.adminOrderLabels.mutlipleLabelData.labelData);
    const cardsLabelFileData = useSelector((state: RootState) => state.adminOrderLabels.labelsUrl.url);
    const labels: OrderLabelsDto[] = [];

    async function updateLabels() {
        if (multipleLabelData.length > 0) {
            setIsLoading(true);
            await dispatch(
                updateMultipleLabels({
                    data: multipleLabelData,
                    id: id,
                }),
            );
            await downloadFromUrl(cardsLabelFileData?.url, `${orderNumber}_label.xlsx`);
            setIsLoading(false);
            dispatch(setEditLabelDialog(false));
        } else if (JSON.stringify(singleLabelData) !== '{}' || JSON.stringify(cardLabel) !== '{}') {
            setIsLoading(true);
            JSON.stringify(singleLabelData) !== '{}'
                ? await dispatch(updateCardLabel(singleLabelData))
                : await dispatch(updateCardLabel(cardLabel));
            setIsLoading(false);
            dispatch(setEditLabelDialog(false));
        } else if (multipleLabelData.length === 0) {
            setIsLoading(true);
            orderLabels.map((orderLabel) => {
                labels.push({
                    cardLabelId: orderLabel.cardLabelId,
                    certificateNumber: orderLabel.certificateNumber,
                    lineOne: orderLabel.lineOne,
                    lineTwo: orderLabel.lineTwo,
                    lineThree: orderLabel.lineThree,
                    lineFour: orderLabel.lineFour,
                    persistChanges: false,
                });
            });
            await dispatch(
                updateMultipleLabels({
                    data: labels,
                    id: id,
                }),
            );
            await downloadFromUrl(cardsLabelFileData?.url, `${orderNumber}_label.xlsx`);
            setIsLoading(false);
            dispatch(setEditLabelDialog(false));
        }
    }

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
                    orderLabels.map((orderLabel) => (
                        <>
                            <LabelsContent labels={orderLabel} isMultipleCards={true} />
                            <Divider />
                        </>
                    ))
                ) : (
                    <LabelsContent labels={cardLabel} isSingleCard={true} />
                )}
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
