import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

export const Page = styled(Grid)(
    ({ theme }) => ({
        flex: '1 1 auto',
        [theme.breakpoints.down('md')]: {
            display: 'block',
        },
        '& .page-content': {
            background: 'linear-gradient(103.29deg, #140078 -18.4%, #6C31BC 112.42%)',
            [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'flex-start',
                marginBottom: '24px',
            },
        },
    }),
    { name: 'Page' },
);
