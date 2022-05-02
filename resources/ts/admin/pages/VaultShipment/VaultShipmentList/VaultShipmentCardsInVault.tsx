import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

export function VaultShipmentCardsInVault() {
    return (
        <Grid container alignItems={'center'} justifyContent={'center'} p={10}>
            <Button variant={'contained'} color={'secondary'} disableElevation sx={{ borderRadius: 8 }}>
                Coming Soon
            </Button>
        </Grid>
    );
}
