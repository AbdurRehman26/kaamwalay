import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import React, { Fragment, PropsWithChildren, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { ConfirmationDialog } from '@shared/components/ConfirmationDialog';
import { useAuth } from '@shared/hooks/useAuth';
import { ContentHolder } from './ContentHolder';
import { LayoutFooter } from './LayoutFooter';
import { LayoutHeader } from './LayoutHeader';
import { LayoutFlags, LayoutOptions } from './LayoutOptions';
import { LayoutSidebar } from './LayoutSidebar';
import { Content, SidebarHolder } from './styles';

interface LayoutProps {
    routeOptions?: Record<string, LayoutOptions>;
}

const Root = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
});

export function Layout(props: PropsWithChildren<LayoutProps>) {
    const { children, routeOptions } = props;
    const location = useLocation();
    const { authenticated } = useAuth();
    const options = useMemo(() => {
        const routes = routeOptions || {};
        const currentRoute = Object.keys(routes).find((path) => !!matchPath(path, location.pathname));
        return currentRoute ? routes[currentRoute] : LayoutOptions.build();
    }, [routeOptions, location.pathname]);

    const ContainerComponent = options.has(LayoutFlags.Container) ? (Container as any) : Fragment;
    const ContentComponent = options.has(LayoutFlags.Content) ? Content : Fragment;

    if (!authenticated || options.isEmpty()) {
        return children as any;
    }

    return (
        <Root>
            {options.has(LayoutFlags.Header) && <LayoutHeader />}
            <Grid container pt={3.5} mb={2.5} flex={'1 1 auto'}>
                <ContainerComponent>
                    <ContentComponent>
                        {options.has(LayoutFlags.Sidebar) ? (
                            <SidebarHolder>
                                <LayoutSidebar />
                            </SidebarHolder>
                        ) : null}

                        <ContentHolder
                            hasSidebar={options.has(LayoutFlags.Sidebar)}
                            hasContent={options.has(LayoutFlags.Sidebar, LayoutFlags.Content)}
                        >
                            {children}
                        </ContentHolder>
                    </ContentComponent>
                </ContainerComponent>
            </Grid>
            <LayoutFooter />
            <ConfirmationDialog />
        </Root>
    );
}
