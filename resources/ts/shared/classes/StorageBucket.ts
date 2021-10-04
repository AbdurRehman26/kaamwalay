import { default as localforage } from 'localforage';
import { StorageBucketInterface } from '../interfaces/StorageBucketInterface';

export class StorageBucket implements StorageBucketInterface {
    private store: LocalForage;
    constructor(private name: string, options?: LocalForageOptions) {
        this.store = localforage.createInstance({
            name: 'globalStorage',
            storeName: name,
            ...(options ?? {}),
        });
    }

    public async length(): Promise<number> {
        return localforage.length();
    }

    public async getObject<T>(key: string): Promise<T | null> {
        return localforage.getItem<T>(key);
    }

    public async putObject<T>(key: string, value: T): Promise<void> {
        await localforage.setItem(key, value);
    }

    public async deleteObject(key: string): Promise<void> {
        await localforage.removeItem(key);
    }

    public async clear(): Promise<void> {
        await localforage.clear();
    }
}
