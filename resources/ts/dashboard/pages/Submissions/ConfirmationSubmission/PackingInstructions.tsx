import React from 'react';

import packingInstructionsPreview from '@shared/assets/packingInstructionsPreview.jpg';

import { SectionHeader } from './SectionHeader';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: PackingInstructions
 * @date: 07.08.2021
 * @time: 00:22
 */
export function PackingInstructions() {
    return (
        <>
            <SectionHeader order={2} headline={'Place Cards & Packing Slip in Box'}>
                Place the cards AND the packing slip in the same package. Make sure that all cards you added in previous
                step as well as the packing slip are in the package, otherwise grading for your submission will not be
                able to be completed.
            </SectionHeader>

            <img src={packingInstructionsPreview} width={300} height={176} alt="Packing instructions" />
        </>
    );
}

export default PackingInstructions;
