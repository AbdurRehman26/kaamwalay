import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { MouseEvent, PropsWithChildren, useCallback, useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import classNames from 'classnames';
import CancelIcon from '@mui/icons-material/Cancel';

interface Props {
    label: string;
    active?: boolean;
    value?: string;
    onClear?: () => void;
}

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 20,
    textTransform: 'capitalize',
    fontSize: 14,
    fontWeight: 400,
    margin: theme.spacing(0, 1),
    padding: '7px 14px',
    borderColor: '#e0e0e0',
    '.MuiSvgIcon-root': {
        color: 'rgba(0, 0, 0, .54)',
    },
    '&.hasValue': {
        '&, .MuiSvgIcon-root': {
            color: theme.palette.primary.main,
        },
    },
    '&:hover, &.active,&.hasValue': {
        backgroundColor: 'transparent',
        borderColor: theme.palette.primary.main,
    },
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
    '.MuiPaper-root': {
        padding: theme.spacing(3, 2.5, 2.5),
        borderRadius: 4,
        marginTop: 4,
        boxShadow: '0 16px 24px rgba(0, 0, 0, 0.14), 0 6px 30px rgba(0, 0, 0, 0.12), 0 8px 10px rgba(0, 0, 0, 0.2)',
    },
}));

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ListPageSelector
 * @date: 23.12.2021
 * @time: 22:37
 */
export function ListPageSelector({ label, active, value, onClear, children }: PropsWithChildren<Props>) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleOpen = useCallback((event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget), []);
    const handleClose = useCallback(() => setAnchorEl(null), []);
    const handleClear = useCallback(
        (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            onClear && onClear();
        },
        [onClear],
    );

    return (
        <>
            <StyledButton
                variant={'outlined'}
                color={'inherit'}
                endIcon={
                    value && onClear ? (
                        <CancelIcon onClick={handleClear} />
                    ) : anchorEl ? (
                        <ArrowDropUpIcon />
                    ) : (
                        <ArrowDropDownIcon />
                    )
                }
                onClick={handleOpen}
                className={classNames({ active: active || !!anchorEl, hasValue: !!value })}
            >
                {label}
                {value ? <>: &nbsp;{value}</> : null}
            </StyledButton>
            <StyledPopover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorReference={'anchorEl'}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {children}
            </StyledPopover>
        </>
    );
}

export default ListPageSelector;
