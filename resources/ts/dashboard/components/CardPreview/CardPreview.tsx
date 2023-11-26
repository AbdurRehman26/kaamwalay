import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { MouseEventHandler, PropsWithChildren, useCallback, useState } from 'react';
import { cx } from '@shared/lib/utils/cx';
import { getStringTruncated } from '@shared/lib/utils/getStringTruncated';
import { font } from '@shared/styles/utils';

type CardPreviewOnlyImageProps = {
    image: string;
    onlyImage: boolean;
};

type CardPreviewProps = {
    id: number;
    image: string;
    name: string;
    shortName: string;
    description: string;
    certification: string;
    grade?: string;
    CheckBox: React.ReactNode;
    selectedIds: [number?];
    handleTransferOwnerShip: any;
};

const useStyles = makeStyles(
    (theme) => ({
        root: {
            color: theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 5,
            boxShadow: theme.shadows[2],
        },
        kebabMenuIcon: {
            background: 'white !important',
            top: 8,
            right: 8,
            padding: '4px 5px 5px 6px',
            position: 'absolute',
            borderRadius: 4,
            backgroundColor: 'white',
            zIndex: 99999,
        },
        gradeScore: {
            position: 'absolute',
            right: 0,
            top: 0,
            padding: '4px 8px',
            borderRadius: '0 0 0 5px',
            backgroundColor: theme.palette.primary.main,
        },
        gradeScoreText: {
            fontWeight: 700,
            color: theme.palette.primary.contrastText,
        },
        imageHolder: {
            cursor: 'pointer',
            position: 'relative',
        },
        image: {
            width: '100%',
            height: 'auto',
            display: 'block',
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            left: 0,
            bottom: 0,
            padding: '8px 12px',
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            textDecoration: 'none',
        },
        headline: {
            marginBottom: 3,
        },
        description: {
            marginBottom: 10,
        },
        smallFont: {
            fontSize: 10,
        },
    }),
    {
        name: 'CardPreview',
    },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: CardPreview
 * @date: 10.08.2021
 * @time: 02:55
 */
export function CardPreview(props: PropsWithChildren<CardPreviewOnlyImageProps | CardPreviewProps>) {
    const { children, onlyImage } = props as PropsWithChildren<CardPreviewOnlyImageProps>;
    const {
        id,
        image,
        grade,
        certification,
        name,
        description,
        shortName,
        CheckBox,
        selectedIds,
        handleTransferOwnerShip,
    } = props as CardPreviewProps;
    const classes = useStyles();
    const isGraded = !!grade && certification;
    const [displayIcon, setDisplayIcon] = useState(false);
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);

    const handleClickOptions = useCallback<MouseEventHandler>(
        (e) => {
            e.stopPropagation();
            setAnchorEl(e.target as Element);
        },
        [setAnchorEl],
    );

    const handleTransferOwner = useCallback(
        (id) => {
            setAnchorEl(null);
            handleTransferOwnerShip(id);
        },
        [handleTransferOwnerShip],
    );

    return (
        <div
            onMouseLeave={() => {
                setDisplayIcon(false);
            }}
            onMouseEnter={() => {
                setDisplayIcon(true);
            }}
            className={classes.root}
        >
            <a role={'button'} href={`/dashboard/cards/${id}/view`} className={classes.imageHolder}>
                <img src={image} alt={name} className={classes.image} />
            </a>
            {!onlyImage && grade && (displayIcon || selectedIds.length) ? CheckBox : null}
            {!onlyImage && grade && displayIcon ? (
                <IconButton onClick={handleClickOptions} className={classes.kebabMenuIcon} size="large">
                    <MoreIcon />
                </IconButton>
            ) : null}

            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                <>
                    <MenuItem onClick={() => handleTransferOwner(id)}>{'Transfer Ownership'}</MenuItem>
                </>
            </Menu>

            {!onlyImage && grade ? (
                <div className={classes.gradeScore}>
                    <Typography color={'textPrimary'} variant={'body1'} className={classes.gradeScoreText}>
                        {grade}
                    </Typography>
                </div>
            ) : null}
            {!onlyImage ? (
                <a role={'button'} href={`/dashboard/cards/${id}/view`} className={classes.content}>
                    <Typography
                        color={'textPrimary'}
                        variant={'body2'}
                        className={cx(classes.headline, font.fontWeightMedium)}
                    >
                        {name}
                    </Typography>
                    <div title={shortName}>
                        <Typography
                            color={'textPrimary'}
                            variant={'caption'}
                            className={cx(classes.description, classes.smallFont)}
                        >
                            {getStringTruncated(shortName, 40)}
                        </Typography>
                    </div>
                    <Typography
                        color={'textPrimary'}
                        variant={'caption'}
                        className={cx(classes.description, classes.smallFont)}
                    >
                        {description}
                    </Typography>
                    <Typography
                        variant={'caption'}
                        color={isGraded ? 'textPrimary' : 'textSecondary'}
                        className={classes.smallFont}
                    >
                        <span className={font.fontWeightMedium}>{isGraded ? 'Certificate #:' : 'Grade Pending'}</span>
                        {isGraded ? <span>{certification}</span> : null}
                    </Typography>
                </a>
            ) : null}
            {children}
        </div>
    );
}

export default CardPreview;
