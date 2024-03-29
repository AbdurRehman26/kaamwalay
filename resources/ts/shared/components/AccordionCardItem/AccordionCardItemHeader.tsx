import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import ButtonBase from '@mui/material/ButtonBase';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { PropsWithChildren, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useAccordionCardItemContext } from './AccordionCardItemContext';

interface AccordionCardItemHeaderProps {
    image: string;
    heading: string;
    subheading: any;
    shortName?: string;
    expand?: boolean;
    action?: ReactNode;
    onPreview?: () => void;
}

const useStyles = makeStyles<Theme, { isExpanded: boolean }>(
    (theme) => ({
        root: {
            display: 'flex',
            alignItems: 'flex-start',
        },
        image: {
            width: '100%',
            display: 'block',
        },
        actions: {
            display: 'inline-flex',
            height: 40,
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        details: {
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            flexGrow: 1,
        },
        imageHolder: ({ isExpanded }) => ({
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: theme.shadows[1],
            transition: theme.transitions.create('width', { duration: 100 }),
            width: isExpanded ? 128 : 28,
        }),
        textHolder: ({ isExpanded }) => ({
            display: 'flex',
            width: '100%',
            transition: theme.transitions.create('padding', { duration: 100 }),
            padding: theme.spacing(0, 0, 0, isExpanded ? 2 : 1),
            flexGrow: 1,
        }),
        heading: ({ isExpanded }) => ({
            fontWeight: 500,
            transition: theme.transitions.create('transform', { duration: 100 }),
            transformOrigin: '0 0',
            transform: `translate3d(0, 0, 0) scale(${isExpanded ? 1 : 0.7})`,
        }),
        shortName: ({ isExpanded }) => ({
            transition: theme.transitions.create('transform', { duration: 100 }),
            transformOrigin: '0 0',
            transform: `translate3d(0, 0, 0) scale(${isExpanded ? 1 : 1})`,
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '10px',
            lineHeight: '14px',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            color: 'rgba(0, 0, 0, 0.54)',
        }),
        subheading: ({ isExpanded }) => ({
            display: 'block',
            transform: `translate3d(0, ${isExpanded ? 0 : -10}px, 0)`,
            transition: theme.transitions.create(['transform', 'margin-bottom'], { duration: 100 }),
            marginBottom: isExpanded ? 0 : '-24px',
        }),
        expandToggleHolder: {
            padding: theme.spacing(0, 0, 0, 1),
        },
        expandToggle: {
            width: 40,
            height: 40,
            padding: 8,
        },
        previewOverlay: {
            backgroundColor: 'rgba(64, 64, 64, 0.6)',
            color: '#fff',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            transition: theme.transitions.create('opacity'),
            '&:hover': {
                opacity: 1,
            },
        },

        contentHolder: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexGrow: 1,
        },
        textInner: {
            display: 'inline-flex',
            flexDirection: 'column',
            flexGrow: 1,
            paddingRight: theme.spacing(2),
        },
        extraContent: {
            paddingLeft: theme.spacing(2),
            width: '100%',
        },
    }),
    { name: 'AccordionCardItemHeader' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: AccordionCardItemHeader
 * @date: 29.08.2021
 * @time: 14:42
 */
export function AccordionCardItemHeader({
    heading,
    subheading,
    image,
    expand,
    action,
    children,
    shortName,
    onPreview,
}: PropsWithChildren<AccordionCardItemHeaderProps>) {
    const { isExpanded, setIsExpanded } = useAccordionCardItemContext();
    const styleProps = useMemo(() => ({ isExpanded }), [isExpanded]);
    const classes = useStyles(styleProps);

    const handleExpand = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, [setIsExpanded]);

    useEffect(() => {
        setIsExpanded(expand ?? false);
    }, [expand, setIsExpanded]);

    return (
        <header className={classes.root}>
            <div className={classes.details}>
                <div className={classes.imageHolder}>
                    <img src={image} alt={heading} className={classes.image} />
                    {onPreview ? (
                        <ButtonBase onClick={onPreview} className={classes.previewOverlay}>
                            <VisibilityIcon color={'inherit'} fontSize={isExpanded ? 'large' : 'small'} />
                        </ButtonBase>
                    ) : null}
                </div>
                <div className={classes.contentHolder}>
                    <div className={classes.textHolder}>
                        <div className={classes.textInner}>
                            <Typography variant={'h6'} className={classes.heading}>
                                {heading}
                            </Typography>
                            <Typography
                                variant={'subtitle2'}
                                sx={{
                                    marginTop: shortName ? (isExpanded ? '-4px' : '-12px') : 0,
                                    marginBottom: shortName ? '6px' : 0,
                                }}
                                className={classes.shortName}
                            >
                                {shortName}
                            </Typography>
                            <Typography variant={'caption'} className={classes.subheading}>
                                {subheading}
                            </Typography>
                        </div>
                        {action ? <div className={classes.actions}>{action}</div> : null}
                        <div className={classes.expandToggleHolder}>
                            <IconButton className={classes.expandToggle} size={'medium'} onClick={handleExpand}>
                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </div>
                    </div>
                    <div className={classes.extraContent}>
                        <Collapse in={isExpanded} unmountOnExit timeout={100}>
                            {children}
                        </Collapse>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default AccordionCardItemHeader;
