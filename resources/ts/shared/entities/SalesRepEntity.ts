import { Type } from 'class-transformer';
import { CommissionTypeEnum } from '@shared/constants/CommissionTypeEnum';
import { SalesRapStatusEnum } from '@shared/constants/SalesRapStatusEnum';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { UserEntity } from './UserEntity';

export class SalesRepEntity extends UserEntity {
    public customers?: number;
    public orders?: number;
    public commissionEarned?: number;
    public commissionPaid?: number;
    public sales?: number;
    public status!: SalesRapStatusEnum;
    public commissionType!: CommissionTypeEnum;
    public commissionValue!: number;
    public unpaidCommission!: number;
    public unpaidCommissionTillLastMonth!: number;
    public paidCommission!: number;

    @Type(() => UserEntity)
    public createdBy!: UserEntity;

    public getCommissionText(type: CommissionTypeEnum, value: number) {
        if (Number(type) === CommissionTypeEnum.FIXED) {
            return formatCurrency(value) + '/Card';
        } else if (Number(type) === CommissionTypeEnum.PERCENTAGE) {
            return value + '%/Card';
        }
        return '-';
    }
}
