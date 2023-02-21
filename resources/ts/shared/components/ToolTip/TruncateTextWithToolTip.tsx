import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

interface TruncateTextWithToolTipProps {
    inputText: string;
    lengthCheck: number;
}

export function TruncateTextWithToolTip({ inputText, lengthCheck }: TruncateTextWithToolTipProps) {
    return (
        <Typography variant={'body2'}>
            {inputText.length > lengthCheck ? (
                <Grid>
                    <Tooltip title={inputText}>
                        <span>{inputText.substring(0, lengthCheck) + '...'}</span>
                    </Tooltip>
                </Grid>
            ) : (
                inputText
            )}
        </Typography>
    );
}

export default TruncateTextWithToolTip;
