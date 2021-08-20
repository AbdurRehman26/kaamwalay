import { Expose } from 'class-transformer';

export class Exception implements Error {
    @Expose()
    public message!: string;
    public name!: string;
    public detail?: string;
    public stack?: string;
    public isException?: boolean = true;

    constructor(message: string, detail?: string) {
        Error.apply(this, [message]);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Exception);
        }

        this.message = message;
        this.detail = detail;
        this.isException = true;
    }
}

Exception.prototype = new Error() as any;
