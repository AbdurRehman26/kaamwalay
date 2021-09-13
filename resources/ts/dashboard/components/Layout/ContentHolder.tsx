import { styled, Theme } from '@material-ui/core/styles';
import { HTMLAttributes } from 'react';

interface ContentHolderProps extends HTMLAttributes<HTMLElement> {
    hasSidebar?: boolean;
    hasContent?: boolean;
}

function ContentHolderComponent({ hasSidebar, hasContent, ...rest }: ContentHolderProps) {
    if (!hasContent) {
        return <>{rest.children}</>;
    }

    return <main {...rest} />;
}

export const ContentHolder = styled(ContentHolderComponent)(
    ({ hasSidebar, theme }: { hasSidebar: boolean; theme: Theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        maxWidth: !hasSidebar ? '100%' : 'calc(100% - 364px)',
        marginLeft: !hasSidebar ? 0 : 24,
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            maxWidth: '100%',
            marginLeft: 0,
        },
    }),
    {
        name: 'ContentHolder',
    },
);
