import { Injectable } from '@shared/decorators/Injectable';
import { Repository } from '../Repository';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';

@Injectable('AdminPromoCodesRepository')
export class AdminPromoCodesRepository extends Repository<PromoCodeEntity> {
    readonly endpointPath: string = 'admin/promo-codes';
    readonly model = PromoCodeEntity;

    async deactivatePromoCode(input: { promoCodeID: number }) {
        const { promoCodeID } = input;
        const { data } = await this.endpoint.post(`/deactivate/${promoCodeID}`);
        return data;
    }

    async deletePromoCode(input: { promoCodeID: number }) {
        const { promoCodeID } = input;
        const { data } = await this.endpoint.post(`/delete/${promoCodeID}`);
        return data;
    }
}
