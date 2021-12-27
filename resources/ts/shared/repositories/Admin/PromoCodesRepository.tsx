import { Injectable } from '@shared/decorators/Injectable';
import { Repository } from '../Repository';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { StoreCouponDTO } from '@shared/dto/StoreCouponDTO';

@Injectable('AdminPromoCodesRepository')
export class AdminPromoCodesRepository extends Repository<PromoCodeEntity> {
    readonly endpointPath: string = 'admin/coupons';
    readonly model = PromoCodeEntity;

    async storeCoupon(input: StoreCouponDTO) {
        const { data } = await this.endpoint.post(``, input);
        return data;
    }
    async changePromoCodeStatus(input: { promoCodeID: number; newStatus: number }) {
        const { promoCodeID, newStatus } = input;
        const { data } = await this.endpoint.put(`/${promoCodeID}/change-status`, {
            status: newStatus,
        });
        return data;
    }

    async deletePromoCode(input: { promoCodeID: number }) {
        const { promoCodeID } = input;
        const { data } = await this.endpoint.delete(`/${promoCodeID}`);
        return data;
    }
}
