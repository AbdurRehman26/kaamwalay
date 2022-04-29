import TabList, { TabListProps } from '@mui/lab/TabList';

export function ListPageTabs({ sx, ...rest }: TabListProps) {
    return <TabList indicatorColor={'primary'} textColor={'primary'} sx={{ mt: 4, ...sx }} {...rest} />;
}
