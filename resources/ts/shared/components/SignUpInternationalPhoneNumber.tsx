import { styled } from '@mui/material/styles';
import MaterialUiPhoneNumber from 'material-ui-phone-number';

const SignUpInternationalPhoneNumber = styled(MaterialUiPhoneNumber)(() => ({
    '&': {
        padding: '0 !important',
        width: '100%',
        border: '1px solid lightgray',
        fontWeight: 400,
        fontSize: '1rem',
        borderRadius: '28px',
    },
    '.MuiInputAdornment-root': {
        padding: '10px 0px 10px 20px',
        marginRight: 0,
    },
    '.MuiInput-input': {
        // borderLeft: '1px solid lightgray',
        padding: '8px 12px 12px 12px!important',
    },
    '.MuiInput-root:before': {
        border: '0 !important',
    },
    '.MuiInput-root:after': {
        border: '0 !important',
    },
    '.MuiInputLabel-root': {
        paddingTop: 8,
        paddingLeft: 24,
    },
    '.MuiButtonBase-root': {
        height: '24px',
        minWidth: '24px',
    },
    // '.MuiButtonBase-root:after': {
    //     content: '"Test"',
    //     height: '10px',
    //     width: '10px',
    //     border: '1px solid blue',
    // },
}));

export default SignUpInternationalPhoneNumber;
