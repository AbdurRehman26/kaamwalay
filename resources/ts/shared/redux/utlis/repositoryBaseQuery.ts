import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError } from 'axios';
import { ClassConstructor } from 'class-transformer';

import { RepositoryKeys } from '../../hooks/useRepositoryMethod';
import { app } from '../../lib/app';
import { Repository } from '../../repositories/Repository';

export function repositoryBaseQuery<
    T extends Repository<any>,
    K extends RepositoryKeys<T> = RepositoryKeys<T>,
    F = T[K],
    R = F extends (...args: any) => any ? ReturnType<F> : unknown,
>(
    repositoryDefinition: ClassConstructor<T>,
): BaseQueryFn<{
    method: K;
    args: F extends (...args: infer P) => any ? P : never;
}> {
    return async ({
        method,
        args,
    }): Promise<
        | {
              data: R;
          }
        | {
              error: {
                  status?: number | null;
                  data?: any;
              };
          }
    > => {
        const repository = app(repositoryDefinition);
        try {
            const data = (await Repository.callMethod(repository, method, ...(args as any))) as any;
            return { data };
        } catch (axiosError) {
            const err = axiosError as AxiosError;
            return {
                error: { status: err.response?.status, data: err.response?.data },
            };
        }
    };
}
