import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import { MouseEvent, PropsWithChildren, useCallback, useState } from 'react';

interface Props {
    label?: string;
    active?: boolean;
    value?: string;
    customValueText?: string;
    onClear?: () => void;
}

const StyledButton = styled(Button)(({ theme }) => ({
    height: 28,
    borderRadius: 20,
    textTransform: 'capitalize',
    fontSize: 14,
    fontWeight: 400,
    margin: theme.spacing(0, 1),
    padding: '7px 14px',
    backgroundColor: '#20BFB814',
    borderColor: '#20BFB814',
    color: '#20BFB8',
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
    '.MuiPaper-root': {
        width: 400,
        padding: theme.spacing(1, 1, 1),
        borderRadius: 4,
        boxShadow: '0 16px 24px rgba(0, 0, 0, 0.14), 0 6px 30px rgba(0, 0, 0, 0.12), 0 8px 10px rgba(0, 0, 0, 0.2)',
    },
}));

export function FilterSelect({
    label = '',
    active,
    value,
    onClear,
    children,
    customValueText = '',
}: PropsWithChildren<Props>) {
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
                {customValueText ? customValueText : null}
                {!customValueText && label ? label : null}
                {!customValueText && label && value ? <>: &nbsp;</> : null}
                {!customValueText && value ? value : null}
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
