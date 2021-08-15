import { styled } from '@material-ui/core/styles';

type SpacerProps = {
    top: string;
};

// That can be <Box mt={} /> tho ...
export default styled('div')(({ top }: SpacerProps) => ({ marginTop: top }), { name: 'Spacer' });
