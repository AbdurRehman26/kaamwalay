import { AxiosResponse } from 'axios';
import { ClassConstructor } from 'class-transformer';
import objectHash from 'object-hash';
import { useCallback, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { useRepository } from '@shared/hooks/useRepository';
import { Repository } from '@shared/repositories/Repository';

export type RepositoryKeys<T extends Repository<any>> = keyof Omit<
    T,
    'toEntities' | 'toEntity' | 'model' | 'apiService' | 'endpoint' | '_endpoint' | 'endpointPath'
>;

export type PromiseValue<T> = T extends Promise<infer P> ? P : unknown;

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
    }, [classDefinition.name, method, options?.args]);

    const fetcher = useCallback(
        (): any => Repository.callMethod(repository, method, ...((options?.args as any) || [])),
        [method, options?.args, repository],
    );

    return useSWR(key, fetcher);
}
