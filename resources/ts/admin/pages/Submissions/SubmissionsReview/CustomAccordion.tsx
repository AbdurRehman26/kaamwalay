import { useCallback, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ButtonBase from '@mui/material/ButtonBase';

interface CustomAccordionProps {
    title: string;
    content: string;
}

export function CustomAccordion(props: CustomAccordionProps) {
    const { title, content } = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, [isOpen]);

    return (
        <>
            <Box display={'flex'} flexDirection={'row'} marginTop={'8px'}>
                <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>{title}</Typography>
                <ButtonBase onClick={handleClick}>{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}</ButtonBase>
            </Box>
            {isOpen ? (
                <Box display={'flex'} flexDirection={'row'} textOverflow={'break-word'}>
                    <Typography sx={{ overflowWrap: 'break-word', maxWidth: '420px', fontSize: '14px' }}>
                        {content}
                    </Typography>
                </Box>
            ) : null}
        </>
    );
}
