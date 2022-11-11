export class UpdateSalesRepRequestDto {
    public firstName!: string;
    public lastName!: string;
    public commissionType!: number;
    public commissionValue!: number;
    public isActive!: boolean;
    public phone?: string;
    public profileImage?: string;
}
