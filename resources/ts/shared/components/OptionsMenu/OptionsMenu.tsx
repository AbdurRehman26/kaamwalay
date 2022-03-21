import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { Children, MouseEvent, PropsWithChildren, ReactNode, isValidElement, useCallback, useState } from 'react';
import { OptionsMenuItemProps } from './OptionsMenuItem';

export interface OptionsMenuProps {
    icon?: ReactNode;
    onClick(action: OptionsMenuItemProps['action'], value?: OptionsMenuItemProps['value']): void;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: OptionsMenu
 * @date: 06.01.2022
 * @time: 00:36
 */
export function OptionsMenu({ children, icon, onClick }: PropsWithChildren<OptionsMenuProps>) {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const handleOpen = useCallback((e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget), [setAnchor]);
    const handleClose = useCallback(() => setAnchor(null), [setAnchor]);

    const renderIcon = () => {
        if (loading) {
            return <CircularProgress color={'inherit'} size={24} />;
        }

        if (icon) {
            return icon;
        }

        return <MoreVertIcon />;
    };

    const renderItems = () =>
        Children.map(children, (child: ReactNode) => {
            if (!child || !isValidElement(child)) {
                return child;
            }

            return {
                ...child,
                props: {
                    ...child.props,
                    async onClick(event: MouseEvent<HTMLElement>) {
                        setLoading(true);

                        try {
                            if (child.props.onClick) {
                                await child.props.onClick(event);
                            }

                            await onClick(child.props.action, child.props.value);
                        } finally {
                            setLoading(false);
                            handleClose();
                        }
                    },
                },
            };
        });

    return (
        <>
            <IconButton onClick={handleOpen}>{renderIcon()}</IconButton>
            <Menu open={!!anchor} anchorEl={anchor} onClose={handleClose}>
                {renderItems()}
            </Menu>
        </>
    );
}
