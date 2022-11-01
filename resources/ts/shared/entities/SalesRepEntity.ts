import { SalesRapStatusEnum } from '@shared/constants/SalesRapStatusEnum';
import { UserEntity } from './UserEntity';

export class SalesRepEntity extends UserEntity {
    public customers?: number;
    public orders?: number;
    public commissionEarned?: number;
    public commissionPaid?: number;
    public sales?: number;
    public status!: SalesRapStatusEnum;
}
