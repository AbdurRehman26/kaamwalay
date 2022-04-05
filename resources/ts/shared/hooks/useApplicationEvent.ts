import { useEffect, useLayoutEffect, useRef } from 'react';
import { ApplicationEventsEnum } from '../constants/ApplicationEventsEnum';
import { EventService } from '../services/EventService';
import { useInjectable } from './useInjectable';

/**
 * A custom hook that allows to subscribe to application events with a custom handler.
 * The subscription and unsubscription is handled by the hook itself.
 * @example
 * ```
 * useApplicationEvent(ApplicationEventsEnum.Unauthorized, (event) => {
 *   console.log('Unauthorized event occurred!');
 * });
 * ```
 * @param event
 * @param handler
 */
export function useApplicationEvent(event: ApplicationEventsEnum, handler: (...args: any[]) => void) {
    const eventService = useInjectable(EventService);
    const handlerRef = useRef(handler);

    useLayoutEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(
        () =>
            eventService.subscribe(event, () => {
                handlerRef.current();
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [event, eventService],
    );
}
