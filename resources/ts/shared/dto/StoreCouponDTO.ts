import { DiscountTypeEnums } from '@shared/constants/DiscountTypeEnums';

export class StoreCouponDTO {
    code!: string;
    type!: DiscountTypeEnums;
    discountValue!: string;
    couponApplicableId!: number;
    availableFrom!: string | null;
    availableTill!: string | null;
    isPermanent!: boolean;
    couponables!: number[];
    description!: string;
}
