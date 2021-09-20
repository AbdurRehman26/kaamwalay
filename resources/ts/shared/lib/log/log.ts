import { Injectable } from '@shared/decorators/Injectable';
import { LogChannel } from './LogChannel';
import { DebugAdapter, LogAdapterClass } from './adapters';

@Injectable('Log')
export class Log {
    private static channels: Record<string, LogChannel> = {};

    /**
     * Create a log channel
     * @example
     * ```
     * // create a channel with the namespace feature
     * const channel = Log.channel('features')
     * ...
     * // create a channel for services:auth namespace
     * const channel = Log.channel(['services', 'auth'])
     * ...
     * // create a channel for services:auth namespace, using custom adapter
     * const channel = Log.channel(['services', 'auth'], ConsoleAdapter)
     * ...
     * // Later in the code
     * channel.info('hi there')
     * ```
     * @param name
     * @param adapter
     */
    public static channel(name: string | string[], adapter?: LogAdapterClass) {
        const name$ = Array.isArray(name) ? name.join(DebugAdapter.SEPARATOR) : name;
        const Adapter = adapter ?? DebugAdapter;

        if (!Log.channels[name$]) {
            Log.channels[name$] = new LogChannel(name$, Adapter);
        }

        return Log.channels[name$];
    }

    /**
     * Log error method
     * @param message
     * @param args
     */
    public static error(message: string, ...args: any[]) {
        return Log.channel('Global').error(message, ...args);
    }

    /**
     * Log warning method
     * @param message
     * @param args
     */
    public static warning(message: string, ...args: any[]) {
        return Log.channel('Global').warning(message, ...args);
    }

    /**
     * Log info method
     * @param message
     * @param args
     */
    public static info(message: string, ...args: any[]) {
        return Log.channel('Global').info(message, ...args);
    }

    /**
     * Log debug method
     * @param message
     * @param args
     */
    public static debug(message: string, ...args: any[]) {
        return Log.channel('Global').debug(message, ...args);
    }

    /**
     * Log message method
     * @param message
     * @param args
     */
    public static print(message: string, ...args: any[]) {
        return Log.channel('Global').print(message, ...args);
    }

    public static canLog(): boolean {
        if (process.env.NODE_ENV === 'test') {
            if (!process.env.ALLOW_LOGS) {
                return false;
            }
        }

        if (process.env.APPLICATION_TYPE === 'SERVER') {
            return true;
        }

        if (process.env.NODE_ENV !== 'production') {
            return true;
        }

        try {
            return ['1', 'true'].includes(localStorage.getItem('__LOGS__') || '');
        } catch (e: any) {
            // nothing
        }

        return false;
    }

    /**
     * Disable some console
     */
    public static configure() {
        if (this.canLog()) {
            try {
                if (localStorage) {
                    localStorage.setItem('debug', 'app:*');
                }
            } catch (e: any) {
                // nothing
            }
        } else {
            console.log = (): void => undefined;
            console.dir = (): void => undefined;
            console.warn = (): void => undefined;
            console.group = (): void => undefined;
            console.groupCollapsed = (): void => undefined;
            console.groupEnd = (): void => undefined;
        }
    }
}
