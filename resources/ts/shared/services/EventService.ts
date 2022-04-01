import { Map, Set } from 'immutable';
import { ApplicationEventsEnum } from '../constants/ApplicationEventsEnum';
import { Injectable } from '../decorators/Injectable';
import { Log4ts } from '../decorators/Log4ts';
import { LogChannel } from '../lib/log';

@Injectable('EventService')
export class EventService {
    private static store: Map<string, Set<(...args: any[]) => any>> = Map();

    @Log4ts('EventService')
    private log!: LogChannel;

    /**
     * Dispatch an event to all listeners
     * @param event
     * @param args
     */
    public emit(event: ApplicationEventsEnum | string, ...args: any[]): void {
        const listeners = this.getListeners(event);
        this.log.debug(`emit ${event}`, { args, listeners: listeners.toJS() });

        listeners.forEach((callback) => callback(...args));
    }

    /**
     * Add a listener to a given event.
     * @param event
     * @param handler
     */
    public subscribe<T extends () => void | Promise<void>>(event: ApplicationEventsEnum | string, handler: T) {
        this.log.debug(`subscribe ${event}`, { handler });
        const listeners = this.getListeners(event);
        EventService.store = EventService.store.set(event, listeners.add(handler));
        return () => this.unsubscribe(event, handler);
    }

    /**
     * Unsubscribe a handler of a given event
     * @param event
     * @param handler
     */
    public unsubscribe<T extends () => void | Promise<void>>(event: ApplicationEventsEnum | string, handler: T) {
        this.log.debug(`unsubscribe ${event}`, { handler });
        const listeners = this.getListeners(event);
        EventService.store = EventService.store.set(event, listeners.delete(handler));
    }

    /**
     * Clear all listeners for a given event.
     * @param event
     */
    public clear(event: ApplicationEventsEnum | string) {
        this.log.debug(`clear ${event}`);
        EventService.store = EventService.store.delete(event);
    }

    /**
     * Get listeners of event.
     * @param event
     * @private
     */
    private getListeners(event: ApplicationEventsEnum | string) {
        return EventService.store.get(event) || Set();
    }

    /**
     * Get number of listeners registered for a given event.
     * @param event
     */
    public count(event: ApplicationEventsEnum | string) {
        return this.getListeners(event).size;
    }

    /**
     * Used only for testing purpose.
     */
    public disableLogging() {
        this.log.setActive(false);
    }
}
