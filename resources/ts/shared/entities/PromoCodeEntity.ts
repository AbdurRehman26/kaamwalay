import { Entity } from './Entity';
import { Type } from 'class-transformer';
import { PromoServiceLevelEntity } from '@shared/entities/PromoServiceLevelEntity';
import { DiscountTypeEnums } from '@shared/constants/DiscountTypeEnums';
import { DiscountApplicationEnums } from '@shared/constants/DiscountApplicationEnum';
import { DiscountDateTypeEnum } from '@shared/constants/DiscountDateTypeEnum';

export class PromoCodeEntity extends Entity {
    public promoCode!: string;
    public discountValue!: string;
    public appliesTo!: string;
    public date!: string;
    public status!: string;
    public timesUsed!: number;
    public totalDiscounts!: string;
    public discountStartDate!: string;
    public discountEndDate!: string;
    public type!: DiscountTypeEnums;
    public discountApplicationType!: DiscountApplicationEnums;
    public discountDateType!: DiscountDateTypeEnum;

    @Type(() => PromoServiceLevelEntity)
    public selectedDiscountServiceLevels!: PromoServiceLevelEntity[];
}
