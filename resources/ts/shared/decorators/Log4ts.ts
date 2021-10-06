import { Log } from '../lib/log';
import { LogAdapterClass } from '../lib/log/adapters/LogAdapter';

/**
 * @example
 * ```
 * class Foo {
 *      @Log4ts('FooService')
 *      log: LogChannel;
 *
 *      // Auto-discover name of the channel (eg: name will become Foo)
 *      @Log4ts()
 *      log: LogChannel;
 *
 *      // Log channel with name and adapter
 *      @Log4ts('FooService', ConsoleAdapter)
 *      log: LogChannel;
 *
 *      foo () {
 *          this.log.info('hi there');
 *      }
 * }
 * ```
 * @param name
 * @param adapter
 * @constructor
 */
export function Log4ts(name?: string | string[], adapter?: LogAdapterClass): any {
    return (target: any) => ({
        value: Log.channel(name ?? target.name ?? target.constructor.name ?? 'global', adapter),
    });
}
