import { Field } from '../decorators/Field';
import { Entity } from './Entity';

export class InvoiceEntity extends Entity {
    @Field('invoice_number')
    public invoiceNumber!: string;

    public path!: string;
}
