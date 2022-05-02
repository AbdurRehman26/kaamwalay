import DoneIcon from '@mui/icons-material/Done';
import Chip, { ChipProps } from '@mui/material/Chip';
import { alpha, styled } from '@mui/material/styles';
import { useCallback, useMemo } from 'react';
import { cx } from '@shared/lib/utils/cx';

type Props = ChipProps & {
    status?: string;
    onCheck?: (value: string) => void;
    active?: boolean;
};

const Root = styled(Chip)(({ theme }) => ({
    height: 40,
    borderRadius: 20,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    color: theme.palette.text.secondary,
    '&.active': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
    },
    '.MuiChip-label': {
        fontWeight: 500,
        fontSize: 14,
    },
}));

export function StatusChip({ active, status, onCheck, ...rest }: Props) {
    const activeProps = useMemo<ChipProps>(() => {
        if (!active) {
            return {};
        }

        return {
            icon: <DoneIcon />,
            color: 'primary',
        };
    }, [active]);

    const handleClickStatus = useCallback(() => {
        if (onCheck && status) {
            onCheck(status);
        }
    }, [onCheck, status]);

    return (
        <Root variant={'outlined'} onClick={handleClickStatus} className={cx({ active })} {...activeProps} {...rest} />
    );
}
