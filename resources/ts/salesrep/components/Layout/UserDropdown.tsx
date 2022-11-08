import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import LocalPoliceOutlined from '@mui/icons-material/LocalPoliceOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { MouseEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RolesEnum } from '@shared/constants/RolesEnum';
import { useAuth } from '@shared/hooks/useAuth';

export function UserDropdown() {
    const { logout, user, authenticated } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const open = Boolean(anchorEl);
    const isAdmin = user?.hasRole(RolesEnum.Admin);
    const isCustomer = user?.hasRole(RolesEnum.Customer);

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
                case '/dashboard':
                    window.location.href = '/dashboard';
                    break;
                default:
                    navigate(href);
            }
        },
        [navigate, logout],
    );

    if (!authenticated) {
        return null;
    }

    return (
        <>
            <IconButton onClick={handleUserProfileOpen}>
                <Avatar src={user?.profileImage ?? user.getInitials()} alt={'Robograding Avatar'} />
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
                {isCustomer ? (
                    <StyledMenuItem onClick={handleUserProfileClick('/dashboard')}>
                        <ListItemIcon>
                            <AccountCircleOutlinedIcon sx={{ color: 'black' }} />
                        </ListItemIcon>
                        Customer Account
                    </StyledMenuItem>
                ) : null}
                {isAdmin ? (
                    <StyledMenuItem onClick={handleUserProfileClick('/admin')}>
                        <ListItemIcon>
                            <LocalPoliceOutlined sx={{ color: 'black' }} />
                        </ListItemIcon>
                        Admin Account
                    </StyledMenuItem>
                ) : null}
                <Divider />
                <StyledMenuItem>
                    <ListItemIcon>
                        <CreateOutlinedIcon sx={{ color: 'black' }} />
                    </ListItemIcon>
                    Edit Profile
                </StyledMenuItem>
                <StyledMenuItem onClick={handleUserProfileClick('/logout')}>
                    <ListItemIcon>
                        <LogoutIcon sx={{ color: 'black' }} />
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
        width: 20,
        height: 20,
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
