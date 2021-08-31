import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Moment } from 'moment';
import { MouseEventHandler, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CustomerShipmentEntity } from '@shared/entities/CustomerShipmentEntity';
import { useConfirmation } from '@shared/hooks/useConfirmation';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import ShipmentNumberModal from '@dashboard/components/SubmissionsTable/ShipmentNumberModal';

interface SubmissionTableRowProps {
    id: number;
    orderNumber: string;
    serviceLevel: number;
    cardsNumber: number;
    status: string;
    invoice?: string;
    invoiceNumber?: string;
    disabled?: boolean;
    customerShipment: null | CustomerShipmentEntity;
    datePlaced?: Date | Moment | null;
    dateArrived?: Date | Moment | null;
}

enum Options {
    View,
    Edit,
    Download,
    Delete,
    ViewInstructions,
    toggleShipmentTrackingModal,
}

export function SubmissionTableRow(props: SubmissionTableRowProps) {
    const {
        id,
        orderNumber,
        datePlaced,
        dateArrived,
        serviceLevel,
        cardsNumber,
        invoice,
        invoiceNumber,
        status,
        customerShipment,
    } = props;

    const history = useHistory();
    const confirm = useConfirmation();

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [showShipmentTrackingModal, setShowShipmentTrackingModal] = useState(false);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);

    const handleOption = useCallback(
        (option: Options) => async () => {
            handleCloseOptions();

            switch (option) {
                case Options.View:
                    history.push(`/submissions/${id}/view`);
                    break;
                case Options.ViewInstructions:
                    history.push(`/submissions/${id}/confirmation`);
                    break;
                case Options.Edit:
                    history.push(`/submissions/${id}/edit`);
                    break;
                case Options.toggleShipmentTrackingModal:
                    setShowShipmentTrackingModal(!showShipmentTrackingModal);
                    break;
                case Options.Delete:
                    const result = await confirm();
                    if (result) {
                        console.log('Delete submission');
                    }
                    break;
                case Options.Download:
                    downloadFromUrl(invoice!, `robograding-${invoiceNumber}.pdf`);
                    break;
            }
        },
        [handleCloseOptions, history, id, confirm, invoice, invoiceNumber, showShipmentTrackingModal],
    );

    return (
        <>
            <ShipmentNumberModal
                id={id}
                customerShipment={customerShipment as CustomerShipmentEntity}
                showModal={showShipmentTrackingModal}
                handleModalVisibility={handleOption(Options.toggleShipmentTrackingModal)}
            />
            <TableRow>
                <TableCell>{orderNumber}</TableCell>
                <TableCell>{datePlaced ? formatDate(datePlaced, 'MM/DD/YYYY') : '-'}</TableCell>
                <TableCell>{dateArrived ? formatDate(dateArrived, 'MM/DD/YYYY') : '-'}</TableCell>
                <TableCell>{`${formatCurrency(serviceLevel)} / Card`}</TableCell>
                <TableCell>{cardsNumber}</TableCell>
                <TableCell>{status}</TableCell>
                <TableCell align={'right'}>
                    <IconButton onClick={handleClickOptions}>
                        <MoreIcon />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                        <MenuItem onClick={handleOption(Options.Download)} disabled={!invoice}>
                            {invoice ? 'Download' : 'Generating'}&nbsp;Packing Slip
                        </MenuItem>
                        <MenuItem onClick={handleOption(Options.ViewInstructions)}>View Instructions</MenuItem>
                        <MenuItem onClick={handleOption(Options.toggleShipmentTrackingModal)}>
                            {customerShipment === null ? 'Add' : 'Edit'}&nbsp;Shipment Tracking #
                        </MenuItem>
                    </Menu>
                </TableCell>
            </TableRow>
        </>
    );
}
