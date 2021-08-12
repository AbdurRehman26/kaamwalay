import { Entity } from '../../entities/Entity';

interface SerializedData<T, I extends string | number> {
    entities: Record<I, T>;
    ids: I[];
}

export function serializeDataList<T extends Entity, I extends string | number = T extends Entity<infer P> ? P : number>(
    data: T[],
): SerializedData<T, I> {
    return data.reduce(
        (prev, item) => ({
            entities: {
                ...prev.entities,
                [item.id]: item,
            },
            ids: [...prev.ids, item.id],
        }),
        {
            entities: {},
            ids: [],
        } as any,
    );
}
