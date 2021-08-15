import { app } from '@shared/lib/app';
import { APIService } from '../../services/APIService';

export function downloadFromUrl(url: string, filename?: string) {
    const apiService = app(APIService);
    return apiService.download(url, filename);
}
