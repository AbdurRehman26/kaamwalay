import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom';
import { SubmissionViewBilling } from '@shared/components/SubmissionViewBilling';
import { SubmissionViewCards } from '@shared/components/SubmissionViewCards';
import { useOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { ViewSubmissionHeader } from './ViewSubmissionHeader';
import { ViewSubmissionInformation } from './ViewSubmissionInformation';
import { ViewSubmissionStatus } from './ViewSubmissionStatus';

/**
 * View Submission page
 * @type Page
 * @public
 * @constructor
 */
export function ViewSubmission() {
    const { id } = useParams<{ id: string }>();
    const { isLoading, isError, data } = useOrderQuery({
        resourceId: id,
        config: {
            params: {
                include: [
                    'paymentPlan',
                    'orderStatusHistory',
                    'orderCustomerShipment',
                    'orderStatusHistory.orderStatus',
                    'invoice',
                ],
            },
        },
    });

    if (isLoading || isError) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                {isLoading ? <CircularProgress /> : <Typography color={'error'}>Error loading submission</Typography>}
            </Box>
        );
    }

    return (
        <Grid container direction={'column'}>
            <ViewSubmissionHeader orderNumber={data?.orderNumber} />
            <Divider />
            <ViewSubmissionStatus
                trackingNumber={data?.orderCustomerShipment?.trackingNumber}
                shipmentProvider={data?.orderCustomerShipment?.shippingProvider}
                orderStatus={data?.status[0].toUpperCase() + data?.status.slice(1)}
            />
            <Divider />
            <ViewSubmissionInformation
                serviceLevel={'Basic'}
                numberOfCards={data?.numberOfCards}
                shippingMethod={data?.shippingMethod?.name}
                createdAt={data?.createdAt}
                declaredValue={data?.totalDeclaredValue}
                customerName={data?.customer?.getFullName()}
                customerEmail={data?.customer?.email}
                customerPhone={data?.customer?.phone}
                customerId={data?.customer?.id}
                serviceFee={0}
                shippingFee={data?.shippingFee}
                total={data?.grandTotal}
            />
            <Divider />
            <Box marginTop={'24px'} />
            <SubmissionViewBilling
                shippingAddress={data?.shippingAddress}
                billingAddress={data?.billingAddress}
                payment={data?.orderPayment}
            />
            <SubmissionViewCards serviceFee={data?.serviceFee} items={data?.orderItems} />
        </Grid>
    );
}
