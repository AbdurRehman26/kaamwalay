import { useCallback, useEffect, useRef, useState } from 'react';

type TimeoutCallback = (retry: () => void) => any;

/**
 * @param callback
 * @param delay
 */
export function useTimeout(callback: TimeoutCallback, delay: number) {
    const [retry, setRetry] = useState(0);
    const callbackRef = useRef(callback);
    const intervalRef = useRef<number>();

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const runner = useCallback(
        function runner() {
            if (!delay) {
                return;
            }

            intervalRef.current = setTimeout(() => {
                callbackRef.current(() => {
                    clearTimeout(intervalRef.current);
                    setRetry((prev) => prev + 1);
                });
            }, delay) as any;

            return () => clearTimeout(intervalRef.current);
        },
        [delay],
    );

    useEffect(() => runner(), [runner, retry]);
}
