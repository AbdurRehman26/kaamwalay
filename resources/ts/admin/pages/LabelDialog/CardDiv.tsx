import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const CardDiv = styled(Grid)({
    display: 'flex',
    justifyContent: 'space-between',

    '.CardInfo': {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
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
        marginRight: '5px',
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
        justifyContent: 'space-between',
        bottom: '95px',
        alignItems: 'center',
        padding: '0px 25px',
        width: '325px',
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

export default CardDiv;
