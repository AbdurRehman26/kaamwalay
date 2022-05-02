export class EditTransactionNotesDto {
    orderId!: string | number;
    transactionId!: string | number;
    notes!: string;
    transactionType!: 'refund' | 'extra_charge';
}
