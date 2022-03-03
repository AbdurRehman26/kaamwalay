import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

export default function PaymentPendingChip() {
    return <StyledPaymentStatus label="Pending" variant={'outlined'} />;
}

const StyledPaymentStatus = styled(Chip)({
    marginTop: 2,
    color: '#da6612',
    borderColor: 'transparent',
    backgroundColor: '#FCF4EC',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 500,
});
