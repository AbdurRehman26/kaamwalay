export interface StorageBucketInterface {
    length(): Promise<number>;
    getObject<T>(key: string): Promise<T | null>;
    putObject<T>(key: string, value: T): Promise<void>;
    deleteObject(key: string): Promise<void>;
    clear(): Promise<void>;
}
