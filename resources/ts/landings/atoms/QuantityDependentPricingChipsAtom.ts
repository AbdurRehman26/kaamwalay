import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const QuantityDependentPricingChipsAtom = createAtom(
    lazy(() => import('../components/QuantityDependentPricingChips/QuantityDependentPricingChips')),
    'quantity-dependent-pricing-chips',
);
