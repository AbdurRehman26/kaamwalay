import Typography from '@material-ui/core/Typography';
import React from 'react';
import { font } from '@shared/styles/utils';
import { SectionHeader } from './SectionHeader';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ShippingInstructions
 * @date: 07.08.2021
 * @time: 00:22
 */
export function ShippingInstructions() {
    return (
        <>
            <SectionHeader order={3} headline={'Ship the Package'}>
                Ship the package to:
            </SectionHeader>
            <Typography variant={'subtitle2'} className={font.fontWeightMedium}>
                AGS Inc.
            </Typography>
            <Typography variant={'subtitle2'} className={font.fontWeightMedium}>
                727 Page Ave
            </Typography>
            <Typography variant={'subtitle2'} className={font.fontWeightMedium}>
                Staten Island, NY 10307
            </Typography>
        </>
    );
}

export default ShippingInstructions;
