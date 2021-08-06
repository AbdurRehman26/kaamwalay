import Container from '@material-ui/core/Container';
import React, { PropsWithChildren, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { ConfirmationDialog } from '@shared/components/ConfirmationDialog';

import LayoutHeader from './LayoutHeader';
import LayoutSidebar from './LayoutSidebar';
import { Content, SidebarHolder, ContentHolder } from './styles';

interface LayoutProps {
    exclude?: string;
}

export function Layout(props: PropsWithChildren<LayoutProps>) {
    const { children, exclude } = props;
    const location = useLocation();

    const isExcluded = useMemo(
        () =>
            !!matchPath(location.pathname, {
                path: exclude,
                exact: true,
            }),
        [exclude, location.pathname],
    );

    if (isExcluded) {
        return children as any;
    }

    return (
        <>
            <LayoutHeader />
            <Container>
                <Content>
                    <SidebarHolder>
                        <LayoutSidebar />
                    </SidebarHolder>
                    <ContentHolder>{children}</ContentHolder>
                </Content>
            </Container>

            <ConfirmationDialog />
        </>
    );
}
