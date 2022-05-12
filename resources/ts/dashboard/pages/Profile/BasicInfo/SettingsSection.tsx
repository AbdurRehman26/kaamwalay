import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { PropsWithChildren } from 'react';

interface Props {
    headline: string;
}

export function SettingsSection({ headline, children }: PropsWithChildren<Props>) {
    return (
        <Paper variant={'outlined'} sx={{ width: '100%', mb: 3 }}>
            <Box pl={2} pt={3}>
                <Typography variant={'h6'} mb={2.5} fontWeight={400}>
                    {headline}
                </Typography>
            </Box>
            <Stack>{children}</Stack>
        </Paper>
    );
}
