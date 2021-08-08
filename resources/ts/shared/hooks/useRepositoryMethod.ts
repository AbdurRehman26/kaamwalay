import { AxiosResponse } from 'axios';
import { ClassConstructor } from 'class-transformer';
import objectHash from 'object-hash';
import { useCallback, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';

import { useRepository } from '@shared/hooks/useRepository';
import { Repository } from '@shared/repositories/Repository';

type RepositoryKeys<T extends Repository<any>> = keyof Omit<
    T,
    'toEntities' | 'toEntity' | 'model' | 'apiService' | 'endpoint' | '_endpoint' | 'endpointPath'
>;

type PromiseValue<T> = T extends Promise<infer P> ? P : unknown;

export function useRepositoryMethod<
    T extends Repository<any>,
    K extends RepositoryKeys<T> = RepositoryKeys<T>,
    F = T[K],
    R = F extends (...args: any) => any ? ReturnType<F> : unknown,
>(
    classDefinition: ClassConstructor<T>,
    method: K,
    options?: {
        args?: F extends (...args: infer P) => any ? P : never;
    },
): SWRResponse<PromiseValue<R>, AxiosResponse> {
    const repository = useRepository(classDefinition);
    const key = useMemo(() => {
        const argsHash = options?.args ? objectHash.sha1(options.args) : '';
        return `${classDefinition.name}@${method}/${argsHash}`;
    }, [options]);

    const fetcher = useCallback((): any => {
        if (repository[method]) {
            const methodFunc = repository[method];
            if (typeof methodFunc === 'function') {
                const caller = methodFunc.bind(repository);
                return caller(...(options?.args ?? []));
            } else {
                throw new Error(`Undefined method '${method}' on repository '${classDefinition.name}'`);
            }
        }
    }, [key]);

    return useSWR(key, fetcher);
}
