import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import CardSubmissionSearchField from '@dashboard/components/CardSubmissionSearchField';
import CardsSearchResults from '@dashboard/components/CardsSearchResults';
import { useAppSelector } from '@dashboard/redux/hooks';
import AddedSubmissionCardsMobileSearchView from '@dashboard/components/AddedSubmissionCardsSearchView';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CardsSearchMobileModal() {
    const isMobileSearchModalOpen = useAppSelector((state) => state.newSubmission.step02Data.isMobileSearchModalOpen);
    const searchValue = useAppSelector((state) => state.newSubmission.step02Data.searchValue);

    return (
        <Dialog fullScreen open={isMobileSearchModalOpen} TransitionComponent={Transition}>
            <Container>
                <CardSubmissionSearchField />
                {searchValue !== '' ? <CardsSearchResults /> : <AddedSubmissionCardsMobileSearchView />}
            </Container>
        </Dialog>
    );
}

export default CardsSearchMobileModal;
