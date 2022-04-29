import TabPanel, { TabPanelProps } from '@mui/lab/TabPanel';

export function ListPageTabContent({ sx, ...rest }: TabPanelProps) {
    return <TabPanel sx={{ p: 0, ...sx }} {...rest} />;
}
