import { useAppSelector } from '@salesrep/redux/hooks';
import React, { PropsWithChildren } from 'react';
import { ConfirmationDialog } from '@shared/components/ConfirmationDialog';
import LayoutHeader from './LayoutHeader';
import LayoutSidebar from './LayoutSidebar';
import { Content, SidebarHolder, useContentHolderStyles } from './styles';

interface LayoutProps {}

export function Layout(props: PropsWithChildren<LayoutProps>) {
    const { children } = props;
    const drawerState = useAppSelector((state) => state.page.drawerOpened);
    const contentHolderClasses = useContentHolderStyles({ drawerState });

    return (
        <>
            <LayoutHeader />
            <Content>
                <SidebarHolder>
                    <LayoutSidebar />
                </SidebarHolder>
                <main className={contentHolderClasses.root}>{children}</main>
            </Content>
            <ConfirmationDialog />
        </>
    );
}
