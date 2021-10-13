import { styled } from '@mui/material/styles';

export const Content = styled('div')({
    display: 'flex',
    alignItems: 'flex-start',
});

export const SidebarHolder = styled('aside')(({ theme }) => ({
    display: 'inline-flex',
    maxWidth: 340,
    flex: '1 1 100%',
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}));
