import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core/styles';

export const Page = styled(Grid)(
    ({ theme }) => ({
        flex: '1 1 auto',
        '& .page-content': {
            background: 'linear-gradient(103.29deg, #140078 -18.4%, #6C31BC 112.42%)',
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
    }),
    { name: 'Page' },
);
