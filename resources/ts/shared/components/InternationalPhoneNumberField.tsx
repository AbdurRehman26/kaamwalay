import makeStyles from '@mui/styles/makeStyles';
import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

const useStyles = makeStyles((theme) => ({
    countryList: {
        maxHeight: '240px !important',
    },
    formControl: {
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

        '&:focus': {
            border: '2px solid #20BFB8 !important',
            boxShadow: 'none !important',
        },
    },
    flagDropdown: {
        padding: '14px 12px !important',
        width: '58px !important',
        borderRight: '1px solid lightgray',

        '& .selected-flag': {
            padding: '0 !important',
        },
    },
}));

const InternationalPhoneNumberField = (props: PhoneInputProps) => {
    const classes = useStyles();
    return (
        <PhoneInput
            {...props}
            dropdownClass={props.dropdownClass ?? classes.countryList}
            inputClass={props.inputClass ?? classes.formControl}
            buttonClass={props.buttonClass ?? classes.flagDropdown}
            specialLabel={props.specialLabel ?? ''}
            countryCodeEditable={props.countryCodeEditable ?? false}
            preferredCountries={props.preferredCountries ?? ['us']}
            country={props.country ?? 'us'}
            placeholder={props.placeholder ?? 'Enter Phone Number'}
        />
    );
};
export default InternationalPhoneNumberField;
