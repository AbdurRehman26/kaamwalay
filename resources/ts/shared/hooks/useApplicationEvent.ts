import { useEffect, useLayoutEffect, useRef } from 'react';
import { ApplicationEventsEnum } from '@shared/constants/ApplicationEventsEnum';
import { useInjectable } from '@shared/hooks/useInjectable';
import { EventService } from '@shared/services/EventService';

export function useApplicationEvent(event: ApplicationEventsEnum, handler: (...args: any[]) => void) {
    const eventService = useInjectable(EventService);
    const handlerRef = useRef(handler);

    useLayoutEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(
        () => {
            eventService.subscribe(event, handlerRef.current);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [event],
    );
}
