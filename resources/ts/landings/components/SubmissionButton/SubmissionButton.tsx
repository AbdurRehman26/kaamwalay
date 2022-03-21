import Button, { ButtonProps } from '@mui/material/Button';

interface Props extends Omit<ButtonProps, 'onClick'> {
    plan?: string;
    buttonContent?: string;

    // Coming from landings
    textColor?: any;
    aosDelay?: any;
}

export function SubmissionButton({ children, plan, buttonContent, textColor, aosDelay, ...rest }: Props) {
    return (
        <Button href={`/dashboard/submissions/new${plan ? `?plan=${plan}` : ''}`} {...rest}>
            {buttonContent || children}
        </Button>
    );
}

export default SubmissionButton;
