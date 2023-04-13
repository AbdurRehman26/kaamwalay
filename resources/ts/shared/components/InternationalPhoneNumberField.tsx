import { styled } from '@mui/material/styles';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

const InternationalPhoneNumberField = styled(PhoneInput)(() => ({
    '.country-list': {
        maxHeight: '240px !important',
    },
    '.form-control': {
        width: '100% !important',
        border: '1px solid lightgray !important',
        borderRadius: '4px !important',
        padding: '11px 12px 11px 70px !important',
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.form-control:focus': {
        border: '2px solid #20BFB8 !important',
        boxShadow: 'none !important',
    },
    '.special-label': {
        display: 'none !important',
    },
    '.selected-flag': {
        padding: '14px 12px !important',
        width: '58px !important',
        borderRight: '1px solid lightgray',
    },
}));

export default InternationalPhoneNumberField;
