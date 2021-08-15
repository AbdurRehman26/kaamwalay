import React from 'react';
import { PrintPackingSlip } from './PrintPackingSlip';
import { SectionHeader } from './SectionHeader';

interface PrintingInformationProps {
    orderId: number;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: PrintingInformation
 * @date: 07.08.2021
 * @time: 00:21
 */
export function PrintingInformation({ orderId }: PrintingInformationProps) {
    return (
        <>
            <SectionHeader order={1} headline={'Print Packing Slip'}>
                Print the packing slip below. You will need to place this packing slip into your package with the cards
                you added to this submission. You can also save the packing slip or find it in the Submission Details
                Page.
            </SectionHeader>
            <PrintPackingSlip orderId={orderId} />
        </>
    );
}

export default PrintingInformation;
