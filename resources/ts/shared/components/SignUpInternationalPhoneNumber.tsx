import { styled } from '@mui/material/styles';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

const SignUpInternationalPhoneNumber = styled(PhoneInput)(() => ({
    '.country-list': {
        maxHeight: '240px !important',
    },
    '.form-control': {
        width: '100% !important',
        border: '1px solid lightgray !important',
        borderRadius: '28px !important',
        padding: '26px 14px 10px 68px !important',
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px !important',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.form-control:focus': {
        borderColor: '#20BFB8 !important',
        boxShadow: 'none !important',
        backgroundColor: 'rgba(32,191,184,0.05)',
    },
    '.special-label': {
        top: '5px !important',
        left: '18px !important',
        backgroundColor: 'transparent !important',
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '12px !important',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '.selected-flag': {
        paddingLeft: '22px !important',
    },
    '.selected-flag .flag': {
        top: '64% !important',
    },
}));

export default SignUpInternationalPhoneNumber;
