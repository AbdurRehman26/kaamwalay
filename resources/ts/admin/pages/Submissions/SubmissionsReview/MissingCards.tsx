import { useCallback } from 'react';
import CardItem from './CardItem';
import CardsList from './CardsList';

export function MissingCards() {
    const hasNoCards = false;
    const handleRemove = useCallback(() => {}, []);

    if (hasNoCards) {
        return null;
    }

    return (
        <CardsList heading={'Missing cards'} totals={1}>
            <CardItem label={'Missing'} onRemove={handleRemove} />
        </CardsList>
    );
}

export default MissingCards;
