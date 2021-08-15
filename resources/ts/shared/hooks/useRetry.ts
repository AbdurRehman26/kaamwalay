import { useCallback, useEffect, useRef } from 'react';
import { useTimeout } from './useTimeout';

type ActionCallback = () => void | Promise<void>;
type ConditionCallback = () => boolean | Promise<boolean>;

enum RetryState {
    Initial,
    Running,
    Stopped,
}

export enum RetryStrategy {
    ExecuteFirst,
    DelayFirst,
}

interface Options {
    // Number of maximum retries
    maxRetries: number;
    // The time between retries
    windowTime: number;

    // Execution strategy
    strategy: RetryStrategy;
}

export function useRetry(
    actionCallback: ActionCallback,
    conditionCallback: ConditionCallback,
    { maxRetries = 3, windowTime = 3000, strategy = RetryStrategy.DelayFirst }: Partial<Options> = {},
) {
    const stateRef = useRef(RetryState.Initial);
    const retriesRef = useRef(1);
    const conditionRef = useRef(conditionCallback);
    const actionRef = useRef(actionCallback);

    useEffect(() => {
        actionRef.current = actionCallback;
        conditionRef.current = conditionCallback;
    }, [actionCallback, conditionCallback]);

    const runner = useCallback(
        async (retry?: () => void) => {
            if (retriesRef.current > maxRetries) {
                return false;
            }

            const condition = await conditionRef.current();
            if (condition) {
                await actionRef.current();
                retriesRef.current += 1;
                retry?.();
                return true;
            }

            return false;
        },
        [maxRetries],
    );

    useEffect(
        () => {
            if (strategy === RetryStrategy.ExecuteFirst) {
                runner().then((canContinue) => {
                    stateRef.current = canContinue ? RetryState.Running : RetryState.Stopped;
                });
            } else if (strategy === RetryStrategy.DelayFirst) {
                stateRef.current = RetryState.Running;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useTimeout((retry) => {
        if (stateRef.current === RetryState.Initial) {
            return retry();
        }

        if (stateRef.current === RetryState.Stopped) {
            return;
        }

        runner(retry);
    }, windowTime);
}
