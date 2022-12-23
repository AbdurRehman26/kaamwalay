import { Injectable } from '@shared/decorators/Injectable';
import { StoreCouponDto } from '@shared/dto/StoreCouponDto';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { Repository } from '../Repository';

@Injectable('AdminPromoCodesRepository')
export class AdminPromoCodesRepository extends Repository<PromoCodeEntity> {
    readonly endpointPath: string = 'admin/coupons';
    readonly model = PromoCodeEntity;

    public async getPromoCodes(input: string) {
        const { data } = await this.endpoint.get(`?page=1&per_page=24&filter[search]=${input}`);
        return this.toEntity(data);
    }

    async storeCoupon(input: StoreCouponDto) {
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
