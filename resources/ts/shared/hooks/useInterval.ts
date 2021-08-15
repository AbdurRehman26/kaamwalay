import { useCallback, useEffect, useRef } from 'react';

type IntervalCallback = () => any;

/**
 * @source https://usehooks-typescript.com/react-hook/use-intervals
 * @param callback
 * @param delay
 */
export function useInterval(callback: IntervalCallback, delay: number) {
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

            intervalRef.current = setInterval(() => {
                callbackRef.current();
            }, delay) as any;

            return () => clearInterval(intervalRef.current);
        },
        [delay],
    );

    useEffect(() => runner(), [runner]);
}
