import { StorageBucket } from '../classes/StorageBucket';
import { Injectable } from '../decorators/Injectable';
import { StorageBucketInterface } from '../interfaces/StorageBucketInterface';

@Injectable('StorageService')
export class StorageService implements StorageBucketInterface {
    private bucket: StorageBucket;
    private buckets: Record<string, StorageBucket> = {};

    constructor() {
        this.bucket = new StorageBucket('global');
    }

    public createBucket(name: string): StorageBucket {
        if (!this.buckets[name]) {
            this.buckets[name] = new StorageBucket(name);
        }
        return this.buckets[name];
    }

    public async clear(): Promise<void> {
        return this.bucket.clear();
    }

    public async deleteObject(key: string): Promise<void> {
        return this.bucket.deleteObject(key);
    }

    public async getObject<T>(key: string): Promise<T | null> {
        return this.bucket.getObject(key);
    }

    public async putObject<T>(key: string, value: T): Promise<void> {
        return this.bucket.putObject(key, value);
    }

    public async length(): Promise<number> {
        return this.bucket.length();
    }
}
