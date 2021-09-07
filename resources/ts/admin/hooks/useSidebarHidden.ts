import { useEffect, useRef } from 'react';
import { useSidebar } from './useSidebar';

export function useSidebarHidden() {
    const [visibility, setVisibility] = useSidebar();
    const previousState = useRef(visibility);

    useEffect(
        () => {
            const previous = previousState.current;
            setVisibility(false);

            return () => {
                setVisibility(previous);
            };
        },
        // eslint-disable-next-line
        [],
    );
}
