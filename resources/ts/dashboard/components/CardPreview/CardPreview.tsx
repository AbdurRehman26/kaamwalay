import MoreIcon from '@mui/icons-material/MoreVert';
import Checkbox from '@mui/material/Checkbox';
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
    selectedIds: [number?];
    handleTransferOwnerShip: any;
    handleSelectClick?: any;
};

const useStyles = makeStyles(
    (theme) => ({
        root: {
            background: 'rgba(244, 244, 244, 1)',
            color: theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 5,
            boxShadow: theme.shadows[2],
            alignItems: 'center',
            height: '290px',
        },
        kebabMenuIcon: {
            background: 'rgba(244, 244, 244, 1)',
            boxShadow: theme.shadows[2],
            top: 8,
            right: 8,
            padding: '4px 5px 5px 6px',
            position: 'absolute',
            borderRadius: 4,
            backgroundColor: 'white',
        },
        gradeScore: {
            position: 'absolute',
            right: 0,
            top: 0,
            padding: '3px 15px',
            borderRadius: '0 0 0 8px',
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
            height: '158px',
            width: '120px',
            display: 'block',
            margin: '20px 0px 10px 0px',
            zIndex: -99999,
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            left: 0,
            bottom: 0,
            padding: '10px 12px',
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
        checkBoxIcon: {
            color: 'rgba(0, 0, 0, 0.54)',
            top: 8,
            left: 8,
            padding: '0px',
            position: 'absolute',
        },
        checkBox: {
            borderRadius: 4,
            background: 'white !important',
            padding: 5,
            boxShadow: theme.shadows[3],
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
        handleSelectClick,
        selectedIds,
        handleTransferOwnerShip,
    } = props as CardPreviewProps;
    const classes = useStyles();
    const isGraded = !!grade && certification;
    const [displayIcon, setDisplayIcon] = useState(false);
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);

    const isSelected = (selectedRowId: number) => {
        return selectedIds.indexOf(selectedRowId) !== -1;
    };

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
            style={{ border: isSelected(id) ? '2px solid #20BFB8' : '' }}
        >
            <a role={'button'} href={`/dashboard/cards/${id}/view`} className={classes.imageHolder}>
                <img src={image} alt={name} className={classes.image} />
            </a>
            {!onlyImage && grade && (displayIcon || selectedIds.length) ? (
                <IconButton className={classes.checkBoxIcon} size="large">
                    <Checkbox
                        className={classes.checkBox}
                        onClick={() => handleSelectClick(id)}
                        checked={isSelected(id)}
                    />
                </IconButton>
            ) : null}
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

            {!onlyImage && grade && !displayIcon ? (
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
