import { styled } from '@material-ui/core/styles';

export const Content = styled('div')({
    display: 'flex',
    alignItems: 'flex-start',
});

export const SidebarHolder = styled('aside')({
    display: 'inline-flex',
    maxWidth: 340,
    flex: '1 1 100%',
});

export const ContentHolder = styled('main')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    maxWidth: 'calc(100% - 364px)',
    marginLeft: 24,
    width: '100%',
});
