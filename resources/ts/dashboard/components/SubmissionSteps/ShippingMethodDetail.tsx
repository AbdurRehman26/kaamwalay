import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const AccordionDiv = styled(Accordion)({
    background: '#F5F5F5',
    borderRadius: '4px',
    boxShadow: 'none',
    position: 'inherit',
    '& .Mui-expanded': {
        minHeight: '0px !important',
    },

    '.Heading': {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.Detail': {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: '#000000',
    },
});

export default function ShippingMethodDetail() {
    return (
        <div>
            <AccordionDiv>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography className={'Heading'}>What is insured shipping?</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: '0px 16px 16px' }}>
                    <Typography className={'Detail'}>
                        AGS insurance begins to apply to your cards once we receive them up to the point that they are
                        marked delivered back to you by our carrier. It covers any loss or damage that might occur to
                        your cards (up to their full value) while they are in our possession or in transit back to you.
                        AGS insurance does not apply to stolen packages (after delivery) or to any shipments you make to
                        AGS. If you want to insure your shipments to AGS, you have to do that independently with your
                        carrier.
                    </Typography>
                </AccordionDetails>
            </AccordionDiv>
            <AccordionDiv sx={{ marginTop: '20px' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                    <Typography className={'Heading'}>What is vault storage?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={'Detail'}>
                        Vault storage allows you to safely store your cards in our AGS Vault. Rather than shipping it
                        back after grading, we will store your slabbed cards in a level-8 secrity safe. Vault storage is
                        completely free and you can opt to have your cards shipped back to you at any point.
                    </Typography>
                </AccordionDetails>
            </AccordionDiv>
        </div>
    );
}
