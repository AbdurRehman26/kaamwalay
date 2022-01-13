import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';

export interface OptionsMenuItemProps extends Omit<MenuItemProps, 'value' | 'action'> {
    action: string | number;
    value?: any;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: OptionsMenuItem
 * @date: 06.01.2022
 * @time: 00:56
 */
export function OptionsMenuItem({ value, action, ...rest }: OptionsMenuItemProps) {
    return <MenuItem {...rest} />;
}
