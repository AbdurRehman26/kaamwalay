import React, { useState } from 'react';
import { ListHeader } from '@dashboard/components/ListHeader';
import { ListCardItems } from '@dashboard/pages/Cards/ListCards/ListCardsItems';

export function ListCards() {
    const [search, setSearch] = useState('');

    return (
        <>
            <ListHeader headline={'Your Cards'} onSearch={setSearch} />
            <ListCardItems search={search} />
        </>
    );
}

export default ListCards;
