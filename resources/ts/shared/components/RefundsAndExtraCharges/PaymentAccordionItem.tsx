import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import * as React from 'react';
import { useMemo, useState } from 'react';
import PaymentEditNotesModal from '@shared/components/RefundsAndExtraCharges/PaymentEditNotesModal';
import { formatDate } from '@shared/lib/datetime/formatDate';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
    ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
    }),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const useStyles = makeStyles({
    amountText: {
        fontWeight: 'bold',
        fontSize: '16px',
    },
    dateText: {
        fontWeight: 'bold',
        fontSize: '12px',
    },
    authorText: {
        color: 'grey',
    },
    notesTitle: {
        fontWeight: 'bold',
    },
});

interface PaymentAccordionItemProps {
    amount: string;
    notes: string;
    author?: string;
    updatedAt?: any;
    mode: 'customer' | 'admin';
    type: 'refund' | 'extra_charge';
    transactionId: string | number;
    orderId: string | number;
}
export default function PaymentAccordionItem({
    amount,
    notes,
    author,
    updatedAt,
    mode,
    type,
    transactionId,
    orderId,
}: PaymentAccordionItemProps) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState<boolean>(false);
    const [showEditNotes, setShowEditNotes] = useState<boolean>(false);

    const handleChange = () => {
        setExpanded(!expanded);
    };

    const signBeforeCurrency = useMemo(() => {
        if (mode === 'admin') {
            if (type === 'refund') {
                return '-';
            }
        }

        if (mode === 'customer') {
            if (type === 'refund') {
                return '-';
            }
        }
    }, [mode, type]);

    const handleEditNotes = () => {
        setShowEditNotes(true);
    };

    return (
        <Box marginBottom={'6px'}>
            {mode === 'customer' ? null : (
                <PaymentEditNotesModal
                    existingNotes={notes}
                    showEditNotes={showEditNotes}
                    setShowEditNotes={setShowEditNotes}
                    transactionId={transactionId}
                    transactionType={type}
                    orderId={orderId}
                />
            )}

            <Accordion expanded={expanded} onChange={handleChange}>
                <AccordionSummary>
                    <Box flexDirection={'column'}>
                        <Typography variant={'subtitle2'} className={classes.amountText}>
                            {signBeforeCurrency}${amount}
                        </Typography>
                        <Box flexDirection={'row'}>
                            <Typography variant={'subtitle2'} className={classes.dateText}>
                                {`${formatDate(updatedAt, 'MM/DD/YYYY')} at ${formatDate(updatedAt, 'hh:mm:ss')}`}
                                {mode === 'admin' ? <span className={classes.authorText}> ({author})</span> : null}
                            </Typography>
                        </Box>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Grid item>
                            <Typography className={classes.notesTitle}>Notes</Typography>
                        </Grid>
                        <Grid item>
                            {mode === 'admin' ? (
                                <Button onClick={handleEditNotes} variant={'text'}>
                                    Edit notes
                                </Button>
                            ) : null}
                        </Grid>
                    </Grid>
                    <Typography marginTop={'12px'}>{notes}</Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
