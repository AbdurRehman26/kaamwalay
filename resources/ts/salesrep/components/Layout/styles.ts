import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';

export const Content = styled('div')({
    display: 'flex',
    alignItems: 'stretch',
    width: '100%',
    flex: '1 1 auto',
    position: 'relative',
    zIndex: 1,
});

export const SidebarHolder = styled('aside')({
    display: 'inline-flex',
    maxWidth: 240,
});

export const useLayoutHeaderStyles = makeStyles(
    {
        root: {
            backgroundColor: '#f9f9f9',
            maxHeight: 64,
            gridColumnStart: 1,
            gridColumnEnd: 3,
            position: 'relative',
            zIndex: 3,
            boxShadow: '0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px rgba(0, 0, 0, 0.12), 0 1px 5px rgba(0, 0, 0, 0.2)',
        },
        toolbar: {
            paddingLeft: 8,
        },
        brand: {
            display: 'block',
            marginLeft: 12,
        },
        brandImage: {
            display: 'block',
            height: 54,
        },
    },
    {
        name: 'DashboardHeader',
    },
);

export const useContentHolderStyles = makeStyles(
    {
        root: ({ drawerState }: Record<string, any>) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            maxWidth: drawerState ? 'calc(100% - 240px)' : '100%',
            width: '100%',
        }),
    },
    {
        name: 'ContentHolder',
    },
);
