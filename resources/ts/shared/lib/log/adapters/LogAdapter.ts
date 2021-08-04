import { Debugger } from 'debug';

export interface LogAdapter {
    error(message: string, ...args: any[]): void;

    warning(message: string, ...args: any[]): void;

    info(message: string, ...args: any[]): void;

    print(message: string, ...args: any[]): void;

    debug(message: string, ...args: any[]): void;

    setActive(state: boolean): void;

    isActive(): boolean;
}

export type LoggerRecord<T = Debugger> = Omit<Record<keyof LogAdapter, T>, 'setActive' | 'isActive'>;

export interface LogAdapterClass {
    new (name: string, baseName: string): LogAdapter;
}
