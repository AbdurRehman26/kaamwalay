import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

export function VaultStorageMethod() {
    return (
        <>
            <Divider />
            <Stack pt={4} maxWidth={520}>
                <Typography variant={'body1'} fontWeight={700} mb={2}>
                    What is Vault Storage?
                </Typography>

                <Typography variant={'body1'} mb={2}>
                    Vault storage allows you to safely store your cards in our AGS vault. Rather than shipping it back
                    after grading, we will store your slabbed card in a level-8 security safe.
                </Typography>

                <Typography variant={'body1'} mb={2}>
                    You can opt to have your card shipped to you at any point.
                </Typography>

                <Typography variant={'body1'}>Vault storage is completely FREE.</Typography>
            </Stack>
        </>
    );
}
