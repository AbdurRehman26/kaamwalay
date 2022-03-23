import MockAdapter from 'axios-mock-adapter';
import { app } from '../lib/app';
import { APIService } from './APIService';

test('APIService create versioned endpoint [default]', async () => {
    const data = [{ id: 1 }];
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('users');
    const mock = new MockAdapter(endpoint);
    mock.onGet(/.*/).reply(200, data);

    const result = await endpoint.get('');
    expect(endpoint.defaults.baseURL?.endsWith('/api/v2/users')).toBeTruthy();
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].baseURL).toBe(endpoint.defaults.baseURL);
    expect(result.data).toMatchObject(data);

    mock.reset();
});

test('APIService create versioned endpoint [v1]', async () => {
    const data = [{ id: 1 }];
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('users', { version: 'v1' });
    const mock = new MockAdapter(endpoint);
    mock.onGet(/.*/).reply(200, data);

    const result = await endpoint.get('');
    expect(endpoint.defaults.baseURL?.endsWith('/api/v1/users')).toBeTruthy();
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].baseURL).toBe(endpoint.defaults.baseURL);
    expect(result.data).toMatchObject(data);

    mock.reset();
});
