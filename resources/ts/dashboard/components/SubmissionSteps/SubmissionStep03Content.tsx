import Divider from '@mui/material/Divider';
import StepDescription from '../StepDescription';
import { ShippingMethods } from './ShippingMethods';

export function SubmissionStep03Content() {
    return (
        <>
            <StepDescription
                title={'Enter shipping details'}
                description={'Select your preferred return shipping method and enter your return shipping address'}
            />

            <Divider light />
            <ShippingMethods />
        </>
    );
}

export default SubmissionStep03Content;
