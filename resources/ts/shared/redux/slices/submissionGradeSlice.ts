import { createAsyncThunk } from '@reduxjs/toolkit';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';

export const resendAccessEmail = createAsyncThunk('resendAccessEmail', async (userId: any) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/customers/${userId}/send-access-email`);
    const resendEmail = await endpoint.post('');
    NotificationsService.success('Access email has been sent.');
    return resendEmail;
});
