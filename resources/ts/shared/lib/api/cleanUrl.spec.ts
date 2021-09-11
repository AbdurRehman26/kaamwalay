import { cleanUrl } from './cleanUrl';

describe('lib/api/cleanUrl', () => {
    it('should clean the url correctly', function () {
        expect(cleanUrl('http://robograding.com')).toBe('http://robograding.com');
        expect(cleanUrl('http://robograding.com/path///to////resource//url')).toBe(
            'http://robograding.com/path/to/resource/url',
        );
        expect(cleanUrl('https://robograding.com')).toBe('https://robograding.com');
        expect(cleanUrl('https://robograding.com/path///to////resource//url')).toBe(
            'https://robograding.com/path/to/resource/url',
        );
        expect(cleanUrl('/path/to/url/')).toBe('/path/to/url/');
        expect(cleanUrl('/path//to/url/')).toBe('/path/to/url/');
        expect(cleanUrl('//path///to////url///string//')).toBe('/path/to/url/string/');
    });
});
