import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(
    {
        root: {
            width: '100%',
            padding: '0 24px',
            display: 'flex',
            flex: '1 1 auto',
            justifyContent: 'center',
            alignItems: 'center',
        },

        content: {
            maxWidth: 380,
        },

        textField: {
            borderRadius: 28,
            backgroundColor: '#f5f5f5',
        },

        textFieldNotchedOutline: {
            borderRadius: 28,
            '& legend': {
                fontWeight: 500,
                color: 'rgba(0,0,0,0.54)',
            },
        },
        forgotLink: {
            fontWeight: 500,
            marginBottom: 32,
        },
    },
    { name: 'SignIn' },
);

export const ActionContent = styled('div')({
    width: '100%',
    justifyContent: 'center',
    display: 'flex',
    marginTop: '25px',
    alignItems: 'center',
    padding: '0px 0px 24px 0px',
});

export const FormRoot = styled('div')({
    width: '100%',
    justifyContent: 'center',
});
