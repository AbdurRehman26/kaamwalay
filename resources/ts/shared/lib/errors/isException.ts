import { Exception } from '@shared/exceptions/Exception';

export function isException(e: any): e is Exception {
    return (e?.isException && e?.message) || e instanceof Exception;
}
