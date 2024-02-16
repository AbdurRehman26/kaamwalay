import Button from '@mui/material/Button';
import MultipleSelectChip from '@shared/components/SelectBox/MultiSelectChip';

export function ServicesMultiSelect() {
    return (
        <>
            <MultipleSelectChip />
            <Button
                className={'primaryButton'}
                variant={'contained'}
                sx={{ marginTop: '20px' }}
                onClick={() => console.log(1)}
            >
                Search Service Provider
            </Button>
        </>
    );
}

export default ServicesMultiSelect;
