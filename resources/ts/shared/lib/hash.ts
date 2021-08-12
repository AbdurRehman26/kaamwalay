import hash from 'hash.js';

export function sha256(data: string) {
    return hash.sha256().update(data).digest('hex');
}
