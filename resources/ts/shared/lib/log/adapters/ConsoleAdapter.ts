import { LogAdapter, LoggerRecord } from './LogAdapter';

export class ConsoleAdapter implements LogAdapter {
    private readonly logger: LoggerRecord<any>;
    private active!: boolean;

    constructor(public name: string, public baseName: string) {
        const base = [baseName, name].filter(Boolean).join(':');

        this.logger = {
            print: (...args: any) => console.log(`${base}`, ...args),
            debug: (...args: any) => console.log(`${base}:debug`, ...args),
            error: (...args: any) => console.error(`${base}:error`, ...args),
            info: (...args: any) => console.info(`${base}:info`, ...args),
            warning: (...args: any) => console.warn(`${base}:warning`, ...args),
        };

        this.setActive(true);
    }

    public print(message: any, ...args: any[]) {
        this.log('print', message, ...args);
        return this;
    }

    public debug(message: any, ...args: any[]) {
        this.log('debug', message, ...args);
        return this;
    }

    public error(message: any, ...args: any[]) {
        this.log('error', message, ...args);
        return this;
    }

    public info(message: any, ...args: any[]) {
        this.log('info', message, ...args);
        return this;
    }

    public warning(message: any, ...args: any[]) {
        this.log('warning', message, ...args);
        return this;
    }

    private log(logType: keyof LoggerRecord, message: any, ...args: any[]) {
        if (this.active) {
            this.logger[logType](message, ...args);
        }

        return this;
    }

    public setActive(state: boolean) {
        this.active = state;
    }

    public isActive(): boolean {
        return this.active;
    }
}
