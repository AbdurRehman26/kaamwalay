export class ChangeOrderItemNotesDto {
    orderId!: number;
    orderItemId!: number;
    notes?: string;
    internalNotes?: string;
}
