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
    minHeight: '53px',
    '&:nth-child(2)': {
        marginTop: '20px',
    },
    '& .Mui-expanded': {
        minHeight: '0px !important',
    },
    '.Heading': {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.DetailSection': {
        padding: '0px 16px 16px',
    },
    '.DetailText': {
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
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="insuredShipping-content"
                    id="insuredShipping-header"
                >
                    <Typography className={'Heading'}>What is insured shipping?</Typography>
                </AccordionSummary>
                <AccordionDetails className={'DetailSection'}>
                    <Typography className={'DetailText'}>
                        AGS insurance begins to apply to your cards once we receive them up to the point that they are
                        marked delivered back to you by our carrier. It covers any loss or damage that might occur to
                        your cards (up to their full value) while they are in our possession or in transit back to you.
                        AGS insurance does not apply to stolen packages (after delivery) or to any shipments you make to
                        AGS. If you want to insure your shipments to AGS, you have to do that independently with your
                        carrier.
                    </Typography>
                </AccordionDetails>
            </AccordionDiv>
            <AccordionDiv>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="vaultStorage-content"
                    id="vaultStorage-header"
                >
                    <Typography className={'Heading'}>What is vault storage?</Typography>
                </AccordionSummary>
                <AccordionDetails className={'DetailSection'}>
                    <Typography className={'DetailText'}>
                        Vault storage allows you to safely store your cards in our AGS Vault. Rather than shipping it
                        back after grading, we will store your slabbed cards in a level-8 secrity safe. Vault storage is
                        completely free and you can opt to have your cards shipped back to you at any point, by simply
                        paying a shipping fee.
                    </Typography>
                </AccordionDetails>
            </AccordionDiv>
        </div>
    );
}
