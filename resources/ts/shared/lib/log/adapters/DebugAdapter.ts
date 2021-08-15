import { debug } from 'debug';
import { LogAdapter, LoggerRecord } from './LogAdapter';

export class DebugAdapter implements LogAdapter {
    public static SEPARATOR = ':';
    private readonly logger: LoggerRecord;
    private active!: boolean;

    constructor(public name: string, public baseName?: string) {
        let logger;
        if (baseName) {
            logger = debug(baseName).extend(name, DebugAdapter.SEPARATOR);
        } else {
            logger = debug(name);
        }

        this.logger = {
            print: logger,
            debug: logger.extend('debug', DebugAdapter.SEPARATOR),
            error: logger.extend('error', DebugAdapter.SEPARATOR),
            info: logger.extend('info', DebugAdapter.SEPARATOR),
            warning: logger.extend('warning', DebugAdapter.SEPARATOR),
        };

        this.setActive(true);

        if (typeof window !== 'undefined') {
            this.logger.print.color = '#000';
            this.logger.debug.color = '#8bc34a';
            this.logger.error.color = '#f44336';
            this.logger.info.color = '#2196f3';
            this.logger.warning.color = '#ffc107';
        } else {
            this.logger.print.color = '6';
            this.logger.debug.color = '10';
            this.logger.error.color = '9';
            this.logger.info.color = '21';
            this.logger.warning.color = '11';
        }
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
        this.logger[logType](message, ...args);
        return this;
    }

    public setActive(state: boolean) {
        this.active = state;
        this.logger.print.enabled = state;
        this.logger.debug.enabled = state;
        this.logger.error.enabled = state;
        this.logger.info.enabled = state;
        this.logger.warning.enabled = state;
    }

    public isActive(): boolean {
        return this.active;
    }
}
