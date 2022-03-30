import { useEffect } from 'react';
import { addressValidationSchema } from '../../../components/SubmissionSteps/addressValidationSchema';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setStepValidation } from '../../../redux/slices/newSubmissionSlice';

export function SubmissionValidator() {
    const dispatch = useAppDispatch();

    const stepValidations = useAppSelector(
        (state) => state.newSubmission.stepValidations,
        (prev, next) => prev.join('') === next.join(''),
    );

    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);

    const addressFirstName = useAppSelector(
        (state) =>
            state.newSubmission.step03Data.selectedExistingAddress.firstName ||
            state.newSubmission.step03Data.selectedAddress.firstName,
    );
    const addressLastName = useAppSelector(
        (state) =>
            state.newSubmission.step03Data.selectedExistingAddress.lastName ||
            state.newSubmission.step03Data.selectedAddress.lastName,
    );
    const addressAddress = useAppSelector(
        (state) =>
            state.newSubmission.step03Data.selectedExistingAddress.address ||
            state.newSubmission.step03Data.selectedAddress.address,
    );
    const addressFlat = useAppSelector(
        (state) =>
            state.newSubmission.step03Data.selectedExistingAddress.flat ||
            state.newSubmission.step03Data.selectedAddress.flat,
    );
    const addressCity = useAppSelector(
        (state) =>
            state.newSubmission.step03Data.selectedExistingAddress.city ||
            state.newSubmission.step03Data.selectedAddress.city,
    );
    const addressState = useAppSelector(
        (state) =>
            state.newSubmission.step03Data.selectedExistingAddress.state ||
            state.newSubmission.step03Data.selectedAddress.state,
    );
    const addressZipCode = useAppSelector(
        (state) =>
            state.newSubmission.step03Data.selectedExistingAddress.zipCode ||
            state.newSubmission.step03Data.selectedAddress.zipCode,
    );
    const addressPhoneNumber = useAppSelector(
        (state) =>
            state.newSubmission.step03Data.selectedExistingAddress.phoneNumber ||
            state.newSubmission.step03Data.selectedAddress.phoneNumber,
    );

    useEffect(() => {
        dispatch(
            setStepValidation({
                step: 1,
                valid: selectedCards.length > 0,
            }),
        );
    }, [dispatch, selectedCards]);

    useEffect(() => {
        const valid = addressValidationSchema.isValidSync({
            firstName: addressFirstName,
            lastName: addressLastName,
            address: addressAddress,
            flat: addressFlat,
            city: addressCity,
            state: addressState,
            zipCode: addressZipCode,
            phoneNumber: addressPhoneNumber,
        });
        dispatch(setStepValidation({ step: 2, valid }));
        dispatch(setStepValidation({ step: 3, valid }));
    }, [
        dispatch,
        addressFirstName,
        addressLastName,
        addressAddress,
        addressFlat,
        addressCity,
        addressState,
        addressZipCode,
        addressPhoneNumber,
    ]);

    useEffect(() => {
        dispatch(
            setStepValidation({
                step: 4,
                valid: stepValidations.slice(0, 4).every((v) => v),
            }),
        );
    }, [dispatch, stepValidations]);

    return null;
}
