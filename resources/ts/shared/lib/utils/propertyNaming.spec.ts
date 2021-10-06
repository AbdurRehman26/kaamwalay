/* eslint-disable camelcase */
import Immutable from 'immutable';
import { camelCase } from 'lodash';
import moment from 'moment';
import { propertyNaming } from './propertyNaming';

describe('utils/propertyNaming', function () {
    it('should convert only object related values', function () {
        class DTO {
            foo_bar!: string;
        }

        const dto = new DTO();
        dto.foo_bar = 'foo';

        const data = {
            blob: new Blob(),
            event: new Event('test'),
            arrayBuffer: new ArrayBuffer(100),
            uint8Array: new Uint8Array(10),
            uint16Array: new Uint16Array(10),
            uint32Array: new Uint32Array(10),
            formData: new FormData(),
            date: new Date(),
            moment: moment(),
            set: new Set(),
            map: new Map(),
            iset: Immutable.Set(),
            imap: Immutable.Map(),
            dto,
        };

        const converter = (data: any) =>
            propertyNaming(data, {
                deep: true,
                keyTransformer: camelCase,
            });

        expect(converter(data.blob)).toEqual(data.blob);
        expect(converter(data.event)).toEqual(data.event);
        expect(converter(data.arrayBuffer)).toEqual(data.arrayBuffer);
        expect(converter(data.uint8Array)).toEqual(data.uint8Array);
        expect(converter(data.uint16Array)).toEqual(data.uint16Array);
        expect(converter(data.uint32Array)).toEqual(data.uint32Array);
        expect(converter(data.formData)).toEqual(data.formData);
        expect(converter(data.date)).toEqual(data.date);
        expect(converter(data.moment)).toEqual(data.moment);
        expect(converter(data.set)).toEqual(data.set);
        expect(converter(data.map)).toEqual(data.map);
        expect(converter(data.iset)).toEqual(data.iset);
        expect(converter(data.imap)).toEqual(data.imap);

        expect(converter(data.dto)).toMatchObject({ fooBar: 'foo' });
    });
});
