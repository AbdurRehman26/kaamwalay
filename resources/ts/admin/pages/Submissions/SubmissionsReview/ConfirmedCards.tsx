import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import { useCallback } from 'react';
import CardItem from './CardItem';
import CardsList from './CardsList';

export function ConfirmedCards() {
    const hasNoCards = false;

    const handleRemove = useCallback(() => {}, []);

    return (
        <CardsList heading={'Confirmed cards'} totals={2}>
            {!hasNoCards ? (
                <>
                    <CardItem
                        label={'Confirmed'}
                        labelIcon={<CheckIcon color={'inherit'} fontSize={'small'} />}
                        onRemove={handleRemove}
                    />
                    <CardItem
                        label={'Confirmed'}
                        labelIcon={<CheckIcon color={'inherit'} fontSize={'small'} />}
                        onRemove={handleRemove}
                    />
                </>
            ) : (
                <Box padding={7} display={'flex'} justifyContent={'center'}>
                    <Typography variant={'body2'} color={'textSecondary'}>
                        No cards confirmed.
                    </Typography>
                </Box>
            )}
        </CardsList>
    );
}

export default ConfirmedCards;
