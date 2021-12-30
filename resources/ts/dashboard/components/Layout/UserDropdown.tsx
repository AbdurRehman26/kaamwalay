import Inventory2Icon from '@mui/icons-material/Inventory2Outlined';
import LogoutIcon from '@mui/icons-material/Logout';
import StyleIcon from '@mui/icons-material/Style';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { MouseEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RobogradingAvatar from '@shared/assets/dummyAvatar.svg';
import { useAuth } from '@shared/hooks/useAuth';
import { RolesEnum } from '@shared/constants/RolesEnum';

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: UserDropdown
 * @date: 06.10.2021
 * @time: 17:08
 */
export function UserDropdown() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const open = Boolean(anchorEl);
    const user$ = useAuth().user;
    const isAdmin = user$.hasRole(RolesEnum.Admin);

    const handleUserProfileOpen = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget),
        [],
    );

    const handleUserProfileClose = useCallback(() => setAnchorEl(null), []);

    const handleUserProfileClick = useCallback(
        (href: string) => () => {
            switch (href) {
                case '/logout':
                    logout();
                    break;
                case '/admin':
                    window.location.href = '/admin';
                    break;
                default:
                    navigate(href);
            }
        },
        [navigate, logout],
    );

    return (
        <>
            <IconButton onClick={handleUserProfileOpen}>
                <Avatar src={user$?.profileImage ?? RobogradingAvatar} alt={'Robograding Avatar'} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleUserProfileClose}
                onClick={handleUserProfileClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    elevation: 0,
                    sx: MenuStyle,
                }}
            >
                <StyledMenuItem onClick={handleUserProfileClick('/submissions')}>
                    <ListItemIcon>
                        <Inventory2Icon />
                    </ListItemIcon>
                    Submissions
                </StyledMenuItem>
                <StyledMenuItem onClick={handleUserProfileClick('/cards')}>
                    <ListItemIcon>
                        <StyleIcon />
                    </ListItemIcon>
                    Your Cards
                </StyledMenuItem>
                {isAdmin ? (
                    <StyledMenuItem onClick={handleUserProfileClick('/admin')}>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        Admin
                    </StyledMenuItem>
                ) : null}
                <Divider />
                <StyledMenuItem onClick={handleUserProfileClick('/logout')}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    Sign Out
                </StyledMenuItem>
            </Menu>
        </>
    );
}

const MenuStyle = {
    overflow: 'visible',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.32)',
    minWidth: 280,
    mt: 1.5,
    '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 22,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
    },
};

const StyledMenuItem = styled(MenuItem)`
    & {
        min-height: 48px;
    }
`;
