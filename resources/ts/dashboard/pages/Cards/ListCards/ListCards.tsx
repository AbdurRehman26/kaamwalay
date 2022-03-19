import React, { useState } from 'react';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useListUserCardsQuery } from '@shared/redux/hooks/useUserCardsQuery';
import { ListHeader } from '@dashboard/components/ListHeader';
import { ListCardItems } from '@dashboard/pages/Cards/ListCards/ListCardsItems';

export function ListCards() {
    const [search, setSearch] = useState('');
    const [sortFilter] = useState('date');
    const userCards$ = useListUserCardsQuery({
        params: {
            sort: sortFilter,
            filter: {
                search,
            },
        },
        ...bracketParams(),
    });

    return (
        <>
            <ListHeader
                headline={'Your Cards'}
                onSearch={setSearch}
                noSearch={userCards$.data.length === 0 && search === ''}
            />
            <ListCardItems search={search} />
        </>
    );
}

export default ListCards;
