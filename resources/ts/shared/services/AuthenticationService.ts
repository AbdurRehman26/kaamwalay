import { StorageBucket } from '@shared/classes/StorageBucket';
import { AuthenticationEnum } from '@shared/constants/AuthenticationEnum';
import { Inject } from '@shared/decorators/Inject';
import { Injectable } from '@shared/decorators/Injectable';
import { StorageService } from '@shared/services/StorageService';

@Injectable()
export class AuthenticationService {
    private storage: StorageBucket;

    constructor(@Inject() private storageService: StorageService) {
        this.storage = this.storageService.createBucket(AuthenticationEnum.StoreName);
    }

    public async getAccessToken(): Promise<string | null> {
        return this.storage.getObject(AuthenticationEnum.AccessTokenName);
    }

    public async setAccessToken(accessToken: string): Promise<void> {
        return this.storage.putObject(AuthenticationEnum.AccessTokenName, accessToken);
    }

    public async removeAccessToken() {
        await this.storage.deleteObject(AuthenticationEnum.AccessTokenName);
    }
}
