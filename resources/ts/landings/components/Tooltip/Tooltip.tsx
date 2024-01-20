import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

interface Props {
    content: string;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '24px',
            letterSpacing: '0.1px',
            textAlign: 'left',
            marginLeft: '5px',
        },
    }),
    { name: 'Tooltip' },
);

export function TooltipIcon({ content }: Props) {
    const names = content.split(',');
    const name = names.shift();
    const classes = useStyles();

    const plusMore = (
        <Typography className={classes.root} sx={{ textDecoration: 'underline' }}>
            {`${names.length} More`}
        </Typography>
    );
    const displayNam = <Typography className={classes.root}>{name}</Typography>;

    const tooltipText = names.join('\n');

    return names.length ? (
        <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>}>
            <Box className={classes.root} display={'flex'}>
                {displayNam}
                {names.length ? plusMore : ''}
            </Box>
        </Tooltip>
    ) : (
        displayNam
    );
}

export default TooltipIcon;
