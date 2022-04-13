import { Type } from 'class-transformer';
import { DiscountApplicationEnums } from '@shared/constants/DiscountApplicationEnum';
import { DiscountDateTypeEnum } from '@shared/constants/DiscountDateTypeEnum';
import { DiscountTypeEnums } from '@shared/constants/DiscountTypeEnums';
import { PromoCodeApplicableEntity } from '@shared/entities/PromoCodeApplicableEntity';
import { PromoCodeStatsEntity } from '@shared/entities/PromoCodeStatsEntity';
import { PromoCodeStatusEntity } from '@shared/entities/PromoCodeStatusEntity';
import { PromoCodeUserEntity } from '@shared/entities/PromoCodeUserEntity';
import { PromoServiceLevelEntity } from '@shared/entities/PromoServiceLevelEntity';
import { Entity } from './Entity';

export class PromoCodeEntity extends Entity {
    public promoCode!: string;
    public code!: string;
    public discountValue!: string;
    public appliesTo!: string;
    public date!: string;
    public status!: string;
    public timesUsed!: number;
    public totalDiscount!: string;
    public availableFrom!: string;
    public availableTill!: string;
    public type!: DiscountTypeEnums;
    public discountApplicationType!: DiscountApplicationEnums;
    public discountDateType!: DiscountDateTypeEnum;
    public isPermanent!: boolean;
    public usageAllowedPerUser!: number | null;

    @Type(() => PromoServiceLevelEntity)
    public selectedDiscountServiceLevels!: PromoServiceLevelEntity[];

    @Type(() => PromoCodeStatsEntity)
    public couponStats!: PromoCodeStatsEntity;

    @Type(() => PromoCodeStatsEntity)
    public couponStatus!: PromoCodeStatusEntity;

    @Type(() => PromoCodeApplicableEntity)
    public couponApplicable!: PromoCodeApplicableEntity;

    @Type(() => PromoCodeUserEntity)
    public createdBy!: PromoCodeUserEntity;
}
