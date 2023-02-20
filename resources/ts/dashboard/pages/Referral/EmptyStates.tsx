import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface props {
    heading: string;
    description: string;
    icon: any;
}

const StyledBox = styled(Box)({
    width: '100%',
    backgroundColor: '#F9F9F9',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    padding: '40px 20px',
    margin: '20px 0px',
    '.Heading': {
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        textAlign: 'center',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.SmallText': {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: 'center',
        letterSpacing: '0.4px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '5px 0px',
    },
});

export function EmptyStates({ heading, description, icon }: props) {
    return (
        <StyledBox>
            <Grid container alignItems={'center'} justifyContent={'center'} rowSpacing={1}>
                <Grid item xs={12} container justifyContent={'center'} alignContent={'center'}>
                    {icon}
                </Grid>
                <Grid item xs={12} alignContent={'center'}>
                    <Typography className={'Heading'}>{heading}</Typography>
                    <Typography className={'SmallText'}>{description}</Typography>
                </Grid>
            </Grid>
        </StyledBox>
    );
}

export default EmptyStates;
