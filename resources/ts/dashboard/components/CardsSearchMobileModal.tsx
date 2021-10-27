import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import CardSubmissionSearchField from '@dashboard/components/CardSubmissionSearchField';
import CardsSearchResults from '@dashboard/components/CardsSearchResults';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { setCardsSearchValue, setIsMobileSearchModalOpen } from '@dashboard/redux/slices/newSubmissionSlice';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(
    {
        addedCardsContainer: {
            marginTop: '32px',
            padding: '16px',
        },
        label: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.1px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        emptyStateContainer: {
            width: '100%',
            height: '153px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        emptyStateText: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '20px',
            textAlign: 'center',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.54)',
        },
    },
    { name: 'CardsSearchMobileModal' },
);
function CardsSearchMobileModal() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isMobileSearchModalOpen = useAppSelector((state) => state.newSubmission.step02Data.isMobileSearchModalOpen);
    const searchValue = useAppSelector((state) => state.newSubmission.step02Data.searchValue);

    const handleClose = () => {
        dispatch(setCardsSearchValue(''));
        dispatch(setIsMobileSearchModalOpen(false));
    };

    return (
        <Dialog fullScreen open={isMobileSearchModalOpen} onClose={handleClose} TransitionComponent={Transition}>
            <Container>
                <CardSubmissionSearchField />
                {searchValue !== '' ? (
                    <CardsSearchResults />
                ) : (
                    <div className={classes.emptyStateContainer}>
                        <Typography variant={'subtitle1'} className={classes.emptyStateText}>
                            Start searching by typing in the field above
                        </Typography>
                    </div>
                )}
            </Container>
        </Dialog>
    );
}

export default CardsSearchMobileModal;
