import { useMediaQuery } from '@mui/material';
import Container from '@mui/material/Container';
import { Theme } from '@mui/material/styles';
import React, { Fragment, PropsWithChildren, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { ConfirmationDialog } from '@shared/components/ConfirmationDialog';
import { useAuth } from '@shared/hooks/useAuth';
import { LayoutFlags, LayoutOptions } from '@dashboard/components/Layout/LayoutOptions';
import LayoutSidebar from '@dashboard/components/Layout/LayoutSidebar';
import { ContentHolder } from './ContentHolder';
import LayoutHeader from './LayoutHeader';
import { Content, SidebarHolder } from './styles';

interface LayoutProps {
    routeOptions?: Record<string, LayoutOptions>;
}

export function Layout(props: PropsWithChildren<LayoutProps>) {
    const { children, routeOptions } = props;
    const location = useLocation();
    const { authenticated } = useAuth();
    const options = useMemo(() => {
        const routes = routeOptions || {};
        const currentRoute = Object.keys(routes).find((path) => !!matchPath(location.pathname, { path, exact: true }));
        return currentRoute ? routes[currentRoute] : LayoutOptions.build();
    }, [routeOptions, location.pathname]);

    const ContainerComponent = options.has(LayoutFlags.Container) ? (Container as any) : Fragment;
    const ContentComponent = options.has(LayoutFlags.Content) ? Content : Fragment;
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    if (!authenticated || options.isEmpty()) {
        return children as any;
    }

    return (
        <>
            {options.has(LayoutFlags.Header) && <LayoutHeader />}
            <ContainerComponent>
                <ContentComponent>
                    {!isMobile && options.has(LayoutFlags.Sidebar) ? (
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

            <ConfirmationDialog />
        </>
    );
}
