import { Slice } from '@reduxjs/toolkit';

export type StateType<S extends Record<string, Slice>> = {
    [K in keyof S]: S[K] extends Slice<infer T> ? T : unknown;
};

export type ReducersType<S extends Record<string, Slice>> = {
    [K in keyof S]: S[K]['reducer'];
};
