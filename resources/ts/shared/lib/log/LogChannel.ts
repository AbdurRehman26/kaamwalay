import { Injectable } from '@shared/decorators/Injectable';
import { DebugAdapter, LogAdapter, LogAdapterClass } from './adapters';

@Injectable('LogChannel')
export class LogChannel {
    private readonly adapter: LogAdapter;

    constructor(public name: string, adapter: LogAdapterClass = DebugAdapter, baseName = '') {
        this.adapter = new adapter(name, baseName);
    }

    /**
     * Channel error method
     * @param message
     * @param args
     */
    public error(message: string, ...args: any[]) {
        this.log('error', message, ...args);
        return this;
    }

    /**
     * Channel warning method
     * @param message
     * @param args
     */
    public warning(message: string, ...args: any[]) {
        this.log('warning', message, ...args);
        return this;
    }

    /**
     * Channel info method
     * @param message
     * @param args
     */
    public info(message: string, ...args: any[]) {
        this.log('info', message, ...args);
        return this;
    }

    /**
     * Channel debug method
     * @param message
     * @param args
     */
    public debug(message: string, ...args: any[]) {
        this.log('debug', message, ...args);
        return this;
    }

    /**
     * Channel print method
     * @param message
     * @param args
     */
    public print(message: string, ...args: any[]) {
        this.log('print', message, ...args);
        return this;
    }

    /**
     * Channel log method
     * @param logType
     * @param message
     * @param args
     * @private
     */
    private log(logType: keyof Omit<LogAdapter, 'setActive' | 'isActive'>, message: string, ...args: any[]) {
        if (this.canLog()) {
            this.adapter[logType](message, ...args);
        }
    }

    /**
     * Check if the channel can log
     * @private
     */
    private canLog() {
        if (process.env.NODE_ENV !== 'production') {
            return true;
        }

        try {
            if (typeof localStorage !== 'undefined' && localStorage.getItem('__LOGS__') !== null) {
                return true;
            }
        } catch (e: any) {
            // nothing
        }

        return false;
    }

    public setActive(state: boolean) {
        this.adapter.setActive(state);

        return this;
    }

    public isActive() {
        return this.adapter.isActive();
    }
}
