import Container from '@material-ui/core/Container';
import React, { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import LayoutHeader from './LayoutHeader';
import LayoutSidebar from './LayoutSidebar';
import { Content, SidebarHolder, ContentHolder } from './styles';

interface LayoutProps {
    exclude?: string;
}

export function Layout(props: PropsWithChildren<LayoutProps>) {
    const { children, exclude } = props;
    const location = useLocation();

    if (location.pathname === exclude) {
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
        </>
    );
}
