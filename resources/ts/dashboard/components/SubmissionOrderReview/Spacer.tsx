import { styled } from '@mui/material/styles';

type SpacerProps = {
    top: string;
};

// That can be <Box mt={} /> tho ...
export default styled('div')(({ top }: SpacerProps) => ({ marginTop: top }), { name: 'Spacer' });
